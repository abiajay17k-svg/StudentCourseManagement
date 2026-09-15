package com.auction.repository;

import com.auction.entity.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    // View all bids for a selected product (ordered from highest to lowest bid amount)
    List<Bid> findByProduct_ProductIdOrderByBidAmountDesc(Long productId);

    // Find and display the highest bid for a product
    Optional<Bid> findTopByProduct_ProductIdOrderByBidAmountDesc(Long productId);
}
