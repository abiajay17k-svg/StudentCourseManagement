package com.auction.service;

import com.auction.entity.Product;
import com.auction.exception.BadRequestException;
import com.auction.exception.ResourceNotFoundException;
import com.auction.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product createProduct(Product product) {
        if (product.getProductName() == null || product.getProductName().trim().isEmpty()) {
            throw new BadRequestException("Product name cannot be empty");
        }
        if (product.getBasePrice() == null || product.getBasePrice() <= 0) {
            throw new BadRequestException("Product base price must be positive");
        }
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
    }
}
