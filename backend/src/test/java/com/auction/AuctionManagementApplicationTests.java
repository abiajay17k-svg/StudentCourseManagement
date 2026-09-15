package com.auction;

import com.auction.dto.BidRequest;
import com.auction.entity.Bid;
import com.auction.entity.Product;
import com.auction.entity.User;
import com.auction.repository.BidRepository;
import com.auction.repository.ProductRepository;
import com.auction.repository.UserRepository;
import com.auction.service.BidService;
import com.auction.service.ProductService;
import com.auction.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AuctionManagementApplicationTests {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private BidService bidService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private BidRepository bidRepository;

    @BeforeEach
    void setUp() {
        bidRepository.deleteAll();
        productRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testCreateAndFetchUsers() {
        User user = new User(null, "John Doe", "john@example.com");
        User saved = userService.createUser(user);

        assertNotNull(saved.getUserId());
        assertEquals("John Doe", saved.getUserName());
        assertEquals("john@example.com", saved.getEmail());

        List<User> users = userService.getAllUsers();
        assertEquals(1, users.size());
    }

    @Test
    void testCreateAndFetchProducts() {
        Product product = new Product(null, "Vintage Watch", 150.0);
        Product saved = productService.createProduct(product);

        assertNotNull(saved.getProductId());
        assertEquals("Vintage Watch", saved.getProductName());
        assertEquals(150.0, saved.getBasePrice());

        List<Product> products = productService.getAllProducts();
        assertEquals(1, products.size());
    }

    @Test
    void testPlaceBidAndFindHighest() {
        User user1 = userService.createUser(new User(null, "Alice", "alice@example.com"));
        User user2 = userService.createUser(new User(null, "Bob", "bob@example.com"));
        Product product = productService.createProduct(new Product(null, "Painting", 100.0));

        // Bid 1: Alice bids 120.0
        BidRequest req1 = new BidRequest(user1.getUserId(), product.getProductId(), 120.0);
        Bid bid1 = bidService.placeBid(req1);
        assertNotNull(bid1.getBidId());

        // Bid 2: Bob bids 180.0
        BidRequest req2 = new BidRequest(user2.getUserId(), product.getProductId(), 180.0);
        Bid bid2 = bidService.placeBid(req2);
        assertNotNull(bid2.getBidId());

        // Verify bids list for product
        List<Bid> bids = bidService.getBidsForProduct(product.getProductId());
        assertEquals(2, bids.size());
        assertEquals(180.0, bids.get(0).getBidAmount()); // ordered desc

        // Verify highest bid
        Bid highest = bidService.getHighestBidForProduct(product.getProductId());
        assertNotNull(highest);
        assertEquals(180.0, highest.getBidAmount());
        assertEquals("Bob", highest.getUser().getUserName());
    }

    @Test
    void testBidBelowBasePriceThrowsException() {
        User user = userService.createUser(new User(null, "Charlie", "charlie@example.com"));
        Product product = productService.createProduct(new Product(null, "Antique Vase", 500.0));

        BidRequest lowBid = new BidRequest(user.getUserId(), product.getProductId(), 300.0);
        assertThrows(RuntimeException.class, () -> bidService.placeBid(lowBid));
    }

    @Test
    void testBidWithNonExistentUserThrowsException() {
        Product product = productService.createProduct(new Product(null, "Desk", 75.0));

        BidRequest invalidBid = new BidRequest(9999L, product.getProductId(), 100.0);
        assertThrows(RuntimeException.class, () -> bidService.placeBid(invalidBid));
    }
}
