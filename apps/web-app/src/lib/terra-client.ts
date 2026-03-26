
export const getTerraClient = () => {
    return {
        getActivity: async (userId: string, startDate: string, endDate: string) => {
            console.warn('[Terra] Mock getActivity called', { userId, startDate, endDate });
            return { data: [] };
        },
        getSleep: async (userId: string, startDate: string, endDate: string) => {
            console.warn('[Terra] Mock getSleep called', { userId, startDate, endDate });
            return { data: [] };
        },
        generateWidgetSession: async (referenceId: string, language: string) => {
            console.warn('[Terra] Mock generateWidgetSession called', { referenceId, language });
            return { url: 'https://demo.tryterra.co' };
        }
    };
};
