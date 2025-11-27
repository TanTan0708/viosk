function Search(){
    return(
        <>
            <div className="searchcontainer">
                <div className="searchbox">
                    <img src="src/assets/Search.png" alt="" />
                    <input type="text" placeholder="Search" maxLength="20" />
                </div>
            </div>
        </>
    );
}

export default Search