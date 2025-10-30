package com.pard.server.hw4.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@SuperBuilder
public class Member extends  BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @Column(nullable = false, unique = true)
    private String userName;

    @Column(nullable = false, unique = false)
    private String displayName;

    @Column(nullable = false)
    private String password;

    public static Member of(String userName, String displayName, String password) {
        return Member.builder()
                .userName(userName)
                .displayName(displayName)
                .password(password)
                .build();
    }

    public void updateDisplayName(String displayName){
        this.displayName = displayName;
    }
}
