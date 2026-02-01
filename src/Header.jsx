function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-top">
                    <div className="logo">
                        <div className="logo-outer">
                            <div className="logo-inner"></div>
                        </div>
                    </div>
                    <button className="shopping-cart-btn">
                        <span className="material-symbols-outlined">shopping_bag</span>
                    </button>
                </div>
                
                <h1 className="welcome-text">
                    Welcome to, Gensan Automotive Parts
                </h1>
                
                <div className="search-container">
                    <span className="material-symbols-outlined search-icon">search</span>
                    <input 
                        className="search-input" 
                        placeholder="Searching for something?" 
                        type="text"
                    />
                </div>
            </div>
        </header>
    );
}

export default Header;