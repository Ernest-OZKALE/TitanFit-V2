import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Mock Dependencies
jest.mock('@/lib/supabase-server');
jest.mock('@/lib/supabase-admin', () => ({
    supabaseAdmin: {
        from: jest.fn(() => ({
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            range: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            insert: jest.fn().mockReturnThis(),
            single: jest.fn().mockReturnThis(),
        })),
    },
}));

describe('Admin Blog API', () => {
    const mockUser = { id: 'admin-id', email: 'admin@titanfit.com' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns 401 if user is not authenticated', async () => {
        (createSupabaseServerClient as jest.Mock).mockResolvedValue({
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
            },
        });

        const req = new NextRequest(new URL('http://localhost/api/admin/blog'));
        const res = await GET(req);

        expect(res.status).toBe(401);
    });

    it('returns 403 if user is not an admin', async () => {
        (createSupabaseServerClient as jest.Mock).mockResolvedValue({
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
            },
            from: jest.fn(() => ({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: { role: 'user' }, error: null }),
            })),
        });

        const req = new NextRequest(new URL('http://localhost/api/admin/blog'));
        const res = await GET(req);

        expect(res.status).toBe(403);
    });

    it('lists posts correctly when authorized', async () => {
        const mockPosts = [{ id: 1, title: 'Test Post' }];

        (createSupabaseServerClient as jest.Mock).mockResolvedValue({
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
            },
            from: jest.fn(() => ({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
            })),
        });

        (supabaseAdmin.from as jest.Mock).mockReturnValue({
            select: jest.fn().mockReturnThis(),
            order: jest.fn().mockReturnThis(),
            range: jest.fn().mockResolvedValue({ data: mockPosts, count: 1, error: null }),
        });

        const req = new NextRequest(new URL('http://localhost/api/admin/blog?limit=10&offset=0'));
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.posts).toEqual(mockPosts);
        expect(data.total).toBe(1);
    });

    it('creates a new post as draft', async () => {
        (createSupabaseServerClient as jest.Mock).mockResolvedValue({
            auth: {
                getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
            },
            from: jest.fn(() => ({
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
            })),
        });

        const mockNewPost = { id: 'new-post-id', title: 'New Post', status: 'draft' };
        (supabaseAdmin.from as jest.Mock).mockReturnValue({
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: mockNewPost, error: null }),
        });

        const req = new NextRequest(new URL('http://localhost/api/admin/blog'), {
            method: 'POST',
            body: JSON.stringify({
                title: 'New Post',
                slug: 'new-post',
                content: 'Some content'
            })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.post.status).toBe('draft');
        expect(supabaseAdmin.from).toHaveBeenCalledWith('cms_content');
    });
});
