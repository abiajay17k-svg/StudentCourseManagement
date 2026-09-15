package com.auction.service;

import com.auction.dto.BidRequest;
import com.auction.entity.Bid;
import com.auction.entity.Product;
import com.auction.entity.User;
import com.auction.exception.BadRequestException;
import com.auction.exception.ResourceNotFoundException;
import com.auction.repository.BidRepository;
import com.auction.repository.ProductRepository;
import com.auction.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Autowired
    public BidService(BidRepository bidRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.bidRepository = bidRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public Bid placeBid(BidRequest request) {
        if (request.getUserId() == null) {
            throw new BadRequestException("User ID is required");
        }
        if (request.getProductId() == null) {
            throw new BadRequestException("Product ID is required");
        }
        if (request.getBidAmount() == null || request.getBidAmount() <= 0) {
            throw new BadRequestException("Bid amount must be positive");
        }

        // Validate user existence
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // Validate product existence
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + request.getProductId()));

        // Validate bid amount against product base price
        if (request.getBidAmount() < product.getBasePrice()) {
            throw new BadRequestException(
                    "Bid amount ($" + request.getBidAmount() + ") cannot be less than the product base price ($" + product.getBasePrice() + ")"
            );
        }

        Bid bid = new Bid();
        bid.setUser(user);
        bid.setProduct(product);
        bid.setBidAmount(request.getBidAmount());

        return bidRepository.save(bid);
    }

    public List<Bid> getBidsForProduct(Long productId) {
        // Validate that product exists
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        return bidRepository.findByProduct_ProductIdOrderByBidAmountDesc(productId);
    }

    public Bid getHighestBidForProduct(Long productId) {
        // Validate that product exists
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found with id: " + productId);
        }
        return bidRepository.findTopByProduct_ProductIdOrderByBidAmountDesc(productId)
                .orElseThrow(() -> new ResourceNotFoundException("No bids placed yet for product id: " + productId));
    }
}
