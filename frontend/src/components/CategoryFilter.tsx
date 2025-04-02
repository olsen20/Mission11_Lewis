import { useEffect, useState } from "react";
import "./CategoryFilter.css";

function CategoryFilter({
    selectedCategories,
    setSelectedCategories,
}: {
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
}) {

    const [categories, setCategories] = useState<string[]>([]);

    // Retrieve Categories from the API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://mission13-backend.azurewebsites.net/api/Books/GetCategories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories: ', error);
            }
        };
        fetchCategories();
    }, []);

    // Function that provides functionality for when a checkbox is checked
    function handleCheckboxChange({target}: {target: HTMLInputElement}) {
        const updatedCategories = selectedCategories.includes(target.value)
            ? selectedCategories.filter((x) => x !== target.value)
            : [...selectedCategories, target.value];
        setSelectedCategories(updatedCategories);
    }

    // Return HTML for category filter
    return (
        <div className="category-filter">
            <h5>Filter by Category Type:</h5>
            <div className="category-list">
                {categories.map((c) => (
                    <div key={c} className="category-item">
                        <input type="checkbox" id={c} value={c} className="category-checkbox" onChange={handleCheckboxChange} />
                        <label htmlFor={c}>{c}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryFilter;