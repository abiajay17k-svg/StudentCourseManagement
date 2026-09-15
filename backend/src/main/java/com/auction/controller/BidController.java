package com.auction.controller;

import com.auction.dto.BidRequest;
import com.auction.entity.Bid;
import com.auction.service.BidService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@CrossOrigin(origins = "*")
public class BidController {

    private final BidService bidService;

    @Autowired
    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping
    public ResponseEntity<Bid> placeBid(@Valid @RequestBody BidRequest request) {
        Bid createdBid = bidService.placeBid(request);
        return new ResponseEntity<>(createdBid, HttpStatus.CREATED);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Bid>> getBidsByProduct(@PathVariable("productId") Long productId) {
        List<Bid> bids = bidService.getBidsForProduct(productId);
        return ResponseEntity.ok(bids);
    }

    @GetMapping("/product/{productId}/highest")
    public ResponseEntity<Bid> getHighestBidByProduct(@PathVariable("productId") Long productId) {
        Bid highestBid = bidService.getHighestBidForProduct(productId);
        return ResponseEntity.ok(highestBid);
    }
}
