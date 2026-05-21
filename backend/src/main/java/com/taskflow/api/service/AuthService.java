package com.taskflow.api.service;

import com.taskflow.api.dto.AuthRequest;
import com.taskflow.api.dto.AuthResponse;
import com.taskflow.api.dto.SignupRequest;
import com.taskflow.api.exception.BadRequestException;
import com.taskflow.api.model.*;
import com.taskflow.api.repository.UserRepository;
import com.taskflow.api.repository.WorkspaceMemberRepository;
import com.taskflow.api.repository.WorkspaceRepository;
import com.taskflow.api.security.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Establish default avatar URL if empty
        String avatar = request.getAvatarUrl();
        if (avatar == null || avatar.isBlank()) {
            avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"; // default sleek avatar
        }

        // 1. Create and Save User
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .avatarUrl(avatar)
                .role(UserRole.MEMBER)
                .build();

        User savedUser = userRepository.save(user);

        // 2. Premium SaaS Onboarding Flow: Provision Default Personal Workspace
        Workspace workspace = Workspace.builder()
                .name(request.getUsername() + "'s Workspace")
                .slug(request.getUsername().toLowerCase().replaceAll("[^a-z0-9]", "-") + "-workspace")
                .description("Default personal sandbox space for task tracking and scheduling.")
                .owner(savedUser)
                .build();

        Workspace savedWorkspace = workspaceRepository.save(workspace);

        // 3. Save Workspace Membership as Owner
        WorkspaceMemberId membershipId = new WorkspaceMemberId(savedWorkspace.getId(), savedUser.getId());
        WorkspaceMember membership = WorkspaceMember.builder()
                .id(membershipId)
                .workspace(savedWorkspace)
                .user(savedUser)
                .memberRole(WorkspaceRole.OWNER)
                .build();

        workspaceMemberRepository.save(membership);

        // 4. Create stateless session token
        String token = jwtUtils.generateToken(savedUser.getUsername());

        return AuthResponse.builder()
                .token(token)
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .avatarUrl(savedUser.getAvatarUrl())
                .role(savedUser.getRole())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        // Authenticate credentials
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
        );

        // Fetch authenticated User Entity from DB
        User user = userRepository.findByUsername(authentication.getName())
                .orElseGet(() -> userRepository.findByEmail(authentication.getName())
                        .orElseThrow(() -> new BadRequestException("User profile not found")));

        // Generate Token
        String token = jwtUtils.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .build();
    }
}
