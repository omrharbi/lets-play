package lets_play.lets_play.utls.constant; 

public class HttpResponseMessages {
    // product
    public static final String PRODUCT_CREATED    = "Product created successfully";
    public static final String PRODUCT_UPDATED    = "Product updated successfully";
    public static final String PRODUCT_DELETED    = "Product deleted successfully";
    public static final String PRODUCT_NOT_FOUND  = "Product not found";
    public static final String PRODUCT_NAME_REQ   = "Product name is required";
    public static final String PRODUCT_DESC_REQ   = "Product description is required";
    public static final String PRODUCT_PRICE_REQ  = "Price must be greater than 0";
    public static final String PRODUCT_ACCESS_DENIED = "Product not found or access denied";
    public static final String PRODUCTS_NOT_FOUND = "No products found";

    // user
    public static final String USER_NOT_FOUND     = "User not found";
    public static final String USER_ID_REQ        = "UserId is required";
    public static final String PRODUCT_ID_REQ     = "ProductId is required";
}