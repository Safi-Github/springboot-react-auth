package com.example.test.controller;

import org.apache.tomcat.util.http.HeaderUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.example.test.repository.MyUserRepository;
import com.example.test.entity.MyUser;
import com.example.test.jwt.JwtUtilityClass;
import com.example.test.service.MyUserDetailService;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UserController {

  private final MyUserRepository myUserRepository;

  public UserController(MyUserRepository myUserRepository) {
      this.myUserRepository = myUserRepository;
  }

  @GetMapping("/users")
  public List<MyUser> getAllUsers() {
      return myUserRepository.findAll();
  }

  //get specific user
  @GetMapping("/user/{id}")
  public Optional<MyUser> getUserById(@PathVariable Long id) {
      return myUserRepository.findById(id);
  }

  @PutMapping("/user/{id}")
  public ResponseEntity<MyUser> updateUser(@PathVariable Long id, @RequestBody MyUser userDetails) {
     Optional<MyUser> existingUser = myUserRepository.findById(id);
     if (existingUser.isEmpty()) {
        return ResponseEntity.notFound().build();
     }

     MyUser user = existingUser.get();
     user.setUsername(userDetails.getUsername());
     user.setRole(userDetails.getRole()); // Adjust according to your entity fields

     MyUser updatedUser = myUserRepository.save(user);

     return ResponseEntity.ok()
            .body(updatedUser);
    }

    //activate or de-activate user
    @PutMapping("/user/{id}/toggle-active")
    public ResponseEntity<MyUser> toggleUserActive(@PathVariable Long id) {
        Optional<MyUser> existingUser = myUserRepository.findById(id);
        if (existingUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
    
        MyUser user = existingUser.get();
        user.setIsActive(!user.getIsActive()); // Toggle isActive status
        MyUser updatedUser = myUserRepository.save(user);
    
        return ResponseEntity.ok(updatedUser);
   }
  
  @DeleteMapping("/users/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    if (!myUserRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }
    myUserRepository.deleteById(id);

    return ResponseEntity
            .noContent()
            .build();
  }

}