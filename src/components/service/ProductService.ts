export class ProductService {
    static async getProductsMini() {
        try {
            const response = await fetch('https://api.artic.edu/api/v1/artworks?page=1');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            console.log(data.data);
            return data; 
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }
}
