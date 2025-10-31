package com.pard.server.hw4.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping(value = {"/", "/login","/signup","/main"})
    public String index() {
        return "forward:/index.html";
    }
}
