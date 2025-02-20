package com.example.test.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.test.repository.MyUserRepository;
import com.example.test.entity.MyUser;
import com.example.test.jwt.JwtUtilityClass;
import com.example.test.jwt.LoginForm;
import com.example.test.service.MyUserDetailService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

@Slf4j
@RestController
// @RequestMapping("/api")
public class AuthController {
  @Autowired
  private AuthenticationManager authenticationManager;
  @Autowired
  private JwtUtilityClass jwtUtilityClass;
  @Autowired
  private MyUserDetailService myUserDetailService;

  private final MyUserRepository myUserRepository;

  public AuthController(MyUserRepository myUserRepository) {
      this.myUserRepository = myUserRepository;
  }

  //using the spring blade thymeleave
  // @GetMapping("/home")
  // public String handleWelcome() {
  //   return "home";
  // }

  // @GetMapping("/admin/home")
  // public String handleAdminHome() {
  //   return "home_admin";
  // }

  // @GetMapping("/user/home")
  // public String handleUserHome() {
  //   return "home_user";
  // }

//   @GetMapping("/protected")
//   public List<MyUser> getAllUsers() {
//       return myUserRepository.findAll();
//   }

@PostMapping("/authenticate")
public ResponseEntity<?> authenticateAndGetToken(@RequestBody LoginForm loginForm) {
    try {
        //authentication start
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginForm.username(), loginForm.password()
            )
        );

        //Does user isActive
        MyUser user = myUserRepository.findByUsername(loginForm.username())
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.getIsActive()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("inactive User. Please contact admin.");
        }

        //generate token
        if (authentication.isAuthenticated()) {
          log.info("This is an INFO level log message");
            String token = jwtUtilityClass.generateToken(
                myUserDetailService.loadUserByUsername(loginForm.username())
            );
            return ResponseEntity.ok(token);
        }
    } catch (BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Authentication error");
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
}

}