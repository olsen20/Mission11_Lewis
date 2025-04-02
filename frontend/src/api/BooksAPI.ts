import { Book } from "../types/Book";

interface FetchBooksResponse {
    books: Book[];
    totalNumBooks: number;
}

const API_URL = 'https://mission13-backend.azurewebsites.net/api/Books';

// API call to retrieve all books from the database
export const fetchBooks = async (
    pageSize: number,
    pageNum: number,
    sortOrder: string,
    selectedCategories: string[]
): Promise<FetchBooksResponse> => {
    try {

        // Configure the parameters
        const categoryParams = selectedCategories
            .map((cat) => `bookTypes=${encodeURIComponent(cat)}`)
            .join('&');

        // Retrieve books from the API
        const response = await fetch(
            `${API_URL}/AllBooks?pageSize=${pageSize}&pageNum=${pageNum}&sortOrder=${sortOrder}${selectedCategories.length ? `&${categoryParams}` : ''}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching books: ', error);
        throw error;
    }
}

// Add a book to the database
export const addBook = async (newBook: Book): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/AddBook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook),
        });

        if (!response.ok) {
            throw new Error('Failed to add book');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding book ', error);
        throw error;
    }
}

// Update a book in the database
export const updateBook = async (
    bookID: number,
    updatedBook: Book
): Promise<Book> => {
    try {
        const response = await fetch(`${API_URL}/UpdateBook/${bookID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBook),
        });
        return await response.json();
    } catch (error) {
        console.error('Error updated book:', error);
        throw error;
    }
}

// Delete a book from the database
export const deleteBook = async (bookID: number): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/DeleteBook/${bookID}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
    } catch (error) {
        console.error('Error deleting book:', error);
        throw error;
    }
}