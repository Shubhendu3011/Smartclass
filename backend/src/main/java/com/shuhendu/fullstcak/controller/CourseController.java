package com.shuhendu.fullstcak.controller;

import com.shuhendu.fullstcak.model.Course;
import com.shuhendu.fullstcak.model.Student;
import com.shuhendu.fullstcak.repository.CourseRepository;
import com.shuhendu.fullstcak.repository.StudentRepository;
import com.shuhendu.fullstcak.util.SessionUtil;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    // ✅ Admin-only: Add a course
    @PostMapping
    public ResponseEntity<Course> addCourse(@RequestBody Course course, HttpSession session) {
        if (!SessionUtil.isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }
        Course saved = courseRepository.save(course);
        return ResponseEntity.ok(saved);
    }

    // ✅ All users: View all courses
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return ResponseEntity.ok(courses);
    }

    // ✅ All users: View course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Admin-only: Delete a course safely
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id, HttpSession session) {
        if (!SessionUtil.isAdmin(session)) {
            return ResponseEntity.status(403).build();
        }

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // 1. Unregister this course from all students first
        List<Student> students = course.getRegisteredStudents();
        if (students != null) {
            for (Student student : students) {
                student.getRegisteredCourses().remove(course);
            }
            studentRepository.saveAll(students); // Save the updated students
        }

        // 2. Now delete the course
        courseRepository.delete(course);

        return ResponseEntity.ok().build();
    }
}
