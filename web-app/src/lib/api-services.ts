// API Service Wrappers for all integrated APIs

// Open Food Facts API
export const openFoodFactsAPI = {
    baseURL: 'https://world.openfoodfacts.org/api/v2',

    async searchByBarcode(barcode: string) {
        const response = await fetch(`${this.baseURL}/product/${barcode}.json`);
        const data = await response.json();

        if (data.status === 1) {
            const product = data.product;
            return {
                name: product.product_name || 'Produit inconnu',
                brand: product.brands || '',
                calories: product.nutriments?.['energy-kcal_100g'] || 0,
                protein: product.nutriments?.proteins_100g || 0,
                carbs: product.nutriments?.carbohydrates_100g || 0,
                fat: product.nutriments?.fat_100g || 0,
                serving: product.serving_size || '100g'
            };
        }
        return null;
    }
};

// wger Workout API
export const wgerAPI = {
    baseURL: 'https://wger.de/api/v2',

    async getExercises(muscle?: string, equipment?: string) {
        let url = `${this.baseURL}/exercise/?language=2&limit=100`;
        if (muscle) url += `&muscles=${muscle}`;
        if (equipment) url += `&equipment=${equipment}`;

        const response = await fetch(url);
        const data = await response.json();
        return data.results.map((ex: any) => ({
            id: ex.id,
            name: ex.name,
            description: ex.description,
            category: ex.category,
            muscles: ex.muscles,
            equipment: ex.equipment
        }));
    },

    async getExerciseImages(exerciseId: number) {
        const response = await fetch(`${this.baseURL}/exerciseimage/?exercise=${exerciseId}`);
        const data = await response.json();
        return data.results.map((img: any) => img.image);
    }
};

// ZenQuotes API
export const zenQuotesAPI = {
    baseURL: 'https://zenquotes.io/api',

    async getQuoteOfDay() {
        const response = await fetch(`${this.baseURL}/today`);
        const data = await response.json();
        return {
            text: data[0].q,
            author: data[0].a
        };
    },

    async getRandomQuote() {
        const response = await fetch(`${this.baseURL}/random`);
        const data = await response.json();
        return {
            text: data[0].q,
            author: data[0].a
        };
    }
};

// Open-Meteo Weather API
export const openMeteoAPI = {
    baseURL: 'https://api.open-meteo.com/v1',

    async getCurrentWeather(lat: number, lon: number) {
        const response = await fetch(
            `${this.baseURL}/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`
        );
        const data = await response.json();
        return {
            temperature: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
            windspeed: data.current_weather.windspeed,
            time: data.current_weather.time
        };
    },

    async getForecast(lat: number, lon: number, days: number = 7) {
        const response = await fetch(
            `${this.baseURL}/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=${days}`
        );
        return await response.json();
    }
};

// Edamam Nutrition API (requires API key)
export const edamamAPI = {
    baseURL: 'https://api.edamam.com/api/nutrition-details',
    appId: process.env.NEXT_PUBLIC_EDAMAM_APP_ID || '',
    appKey: process.env.NEXT_PUBLIC_EDAMAM_APP_KEY || '',

    async analyzeRecipe(ingredientsList: string[]) {
        if (!this.appId || !this.appKey) {
            console.warn('Edamam API keys not configured');
            return null;
        }

        const response = await fetch(
            `${this.baseURL}?app_id=${this.appId}&app_key=${this.appKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingr: ingredientsList })
            }
        );

        const data = await response.json();
        return {
            calories: data.calories,
            protein: data.totalNutrients.PROCNT.quantity,
            carbs: data.totalNutrients.CHOCDF.quantity,
            fat: data.totalNutrients.FAT.quantity,
            nutrients: data.totalNutrients
        };
    }
};

// Spoonacular API (requires API key)
export const spoonacularAPI = {
    baseURL: 'https://api.spoonacular.com',
    apiKey: process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY || '',

    async searchRecipes(query: string, maxCalories?: number) {
        if (!this.apiKey) {
            console.warn('Spoonacular API key not configured');
            return [];
        }

        let url = `${this.baseURL}/recipes/complexSearch?apiKey=${this.apiKey}&query=${query}&addRecipeNutrition=true&number=10`;
        if (maxCalories) url += `&maxCalories=${maxCalories}`;

        const response = await fetch(url);
        const data = await response.json();
        return data.results;
    },

    async getRecipeInformation(id: number) {
        const response = await fetch(
            `${this.baseURL}/recipes/${id}/information?apiKey=${this.apiKey}&includeNutrition=true`
        );
        return await response.json();
    }
};

// Unsplash API
export const unsplashAPI = {
    baseURL: 'https://api.unsplash.com',
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',

    async searchPhotos(query: string, perPage: number = 10) {
        if (!this.accessKey) {
            console.warn('Unsplash API key not configured');
            return [];
        }

        const response = await fetch(
            `${this.baseURL}/search/photos?query=${query}&per_page=${perPage}&client_id=${this.accessKey}`
        );
        const data = await response.json();
        return data.results.map((photo: any) => ({
            id: photo.id,
            url: photo.urls.regular,
            thumb: photo.urls.thumb,
            author: photo.user.name,
            authorUrl: photo.user.links.html
        }));
    },

    async getRandomPhoto(query?: string) {
        let url = `${this.baseURL}/photos/random?client_id=${this.accessKey}`;
        if (query) url += `&query=${query}`;

        const response = await fetch(url);
        const photo = await response.json();
        return {
            url: photo.urls.regular,
            author: photo.user.name
        };
    }
};

// Google Maps Places API
export const googleMapsAPI = {
    baseURL: 'https://maps.googleapis.com/maps/api/place',
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',

    async findHealthyRestaurants(lat: number, lon: number, radius: number = 2000) {
        if (!this.apiKey) {
            console.warn('Google Maps API key not configured');
            return [];
        }

        const response = await fetch(
            `${this.baseURL}/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=restaurant&keyword=healthy|salad|fitness&key=${this.apiKey}`
        );
        const data = await response.json();
        return data.results.map((place: any) => ({
            name: place.name,
            rating: place.rating,
            address: place.vicinity,
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            photos: place.photos?.[0]?.photo_reference
        }));
    },

    async findGyms(lat: number, lon: number, radius: number = 5000) {
        const response = await fetch(
            `${this.baseURL}/nearbysearch/json?location=${lat},${lon}&radius=${radius}&type=gym&key=${this.apiKey}`
        );
        const data = await response.json();
        return data.results;
    }
};

// OpenAI Vision API
export const openAIVisionAPI = {
    baseURL: 'https://api.openai.com/v1',
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',

    async analyzeMealPhoto(imageBase64: string) {
        if (!this.apiKey) {
            console.warn('OpenAI API key not configured');
            return null;
        }

        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Analyze this meal photo and estimate: food name, calories, protein (g), carbs (g), fat (g). Return as JSON.'
                            },
                            {
                                type: 'image_url',
                                image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
                            }
                        ]
                    }
                ],
                max_tokens: 300
            })
        });

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    }
};

// Spotify API
export const spotifyAPI = {
    baseURL: 'https://api.spotify.com/v1',

    async getWorkoutPlaylists(token: string) {
        const response = await fetch(
            `${this.baseURL}/browse/categories/workout/playlists?limit=20`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        const data = await response.json();
        return data.playlists.items;
    },

    async searchPlaylists(query: string, token: string) {
        const response = await fetch(
            `${this.baseURL}/search?q=${query}&type=playlist&limit=10`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );
        const data = await response.json();
        return data.playlists.items;
    }
};
