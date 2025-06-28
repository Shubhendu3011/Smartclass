package com.shuhendu.fullstcak.util;

import com.shuhendu.fullstcak.model.AppUser;
import jakarta.servlet.http.HttpSession;

public class SessionUtil {

    // ✅ Check if current session user is Admin
    public static boolean isAdmin(HttpSession session) {
        Object userObj = session.getAttribute("user");

        if (userObj == null) {
            throw new RuntimeException("No user is logged in!");
        }

        if (userObj instanceof AppUser user) {
            return "ADMIN".equalsIgnoreCase(user.getRole());
        }

        throw new RuntimeException("Invalid session user object!");
    }

    // ✅ Check if logged-in session user is Student
    public static boolean isStudent(HttpSession session) {
        Object userObj = session.getAttribute("user");

        if (userObj == null) {
            throw new RuntimeException("No user is logged in!");
        }

        if (userObj instanceof AppUser user) {
            return "STUDENT".equalsIgnoreCase(user.getRole());
        }

        throw new RuntimeException("Invalid session user object!");
    }

    // ✅ Get current logged-in username (common use)
    public static String getUsername(HttpSession session) {
        Object userObj = session.getAttribute("user");

        if (userObj instanceof AppUser user) {
            return user.getUsername();
        }

        throw new RuntimeException("No user session available.");
    }
}
