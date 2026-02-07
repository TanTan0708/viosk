function Header({ siteTitle }) {
    return (
        <header className="header">
            <div className="header-content">
                <img src="/vite.svg" alt="Background logo" className="header-bg-logo" />
                <button className="shopping-cart-btn">
                    <span className="material-symbols-outlined">shopping_bag</span>
                </button>
                <div className="header-top">
                    <div className="logo">
                        <img src="/vite.svg" alt="Vite logo" className="logo-img" />
                    </div>
                </div>
                
                <h1 className="welcome-text">
                    Welcome to, {siteTitle}
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