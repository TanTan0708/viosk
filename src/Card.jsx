function Card(){
    return(
        <>
            <div className="cardcontainer">
                <div className="price">
                    <div className="leftprice">
                        <p>PHP 8000.25</p>
                    </div>
                    <div className="rightprice">
                        <img src="src/assets/Info.png" alt="" />
                    </div>
                </div>
                <div className="picture">
                    <img src="src/assets/tire.png" alt="" />
                </div>
                <div className="name">
                    <p>Brand #1 Tire</p>
                </div>
                <div className="tagscontainer">
                    <div className="tags">
                        <p>Wheel</p>
                    </div>
                    <div className="tags">
                        <p>67 inch</p>
                    </div>
                </div>
                <div className="addtocartcontainer">
                    <div className="addtocart">
                        <div className="leftcart">
                            <img src="src/assets/ShoppingCart.png" alt="" />
                        </div>
                        <div className="rightcart">
                            <p>Add to Cart</p>
                        </div>
                        
                    </div>
                </div>
            </div>

        </>
    );
}

export default Card