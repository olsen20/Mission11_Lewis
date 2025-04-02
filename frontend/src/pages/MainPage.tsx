// This is the main page that lists all of the books and allows the user to sort and filter them

import { useState } from "react";
import BookList from "../components/BookList";
import CategoryFilter from "../components/CategoryFilter";
import Welcome from "../components/Welcome";
import CartSummary from "./CartSummary";

function MainPage() {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    return (
        <>
            <CartSummary />
            <div className="container">
                <div className="row">
                    < Welcome />
                </div>
                <div className="row">
                    <div className="col-md-3">
                        < CategoryFilter 
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}/>
                    </div>
                    <div className="col-md-9">
                        < BookList selectedCategories={selectedCategories}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainPage;