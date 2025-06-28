package com.shuhendu.fullstcak.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String email;

    @ManyToMany
    @JoinTable(
        name = "student_registered_courses",
        joinColumns = @JoinColumn(name = "registered_students_id"),
        inverseJoinColumns = @JoinColumn(name = "registered_courses_id")
    )
    @JsonIgnoreProperties("registeredStudents") // 👈 prevent infinite recursion
    private List<Course> registeredCourses;

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public List<Course> getRegisteredCourses() {
        return this.registeredCourses;
    }
    
    public void setRegisteredCourses(List<Course> registeredCourses) {
        this.registeredCourses = registeredCourses;
    }
}
