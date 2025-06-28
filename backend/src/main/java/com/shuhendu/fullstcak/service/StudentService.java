package com.shuhendu.fullstcak.service;

import com.shuhendu.fullstcak.model.AppUser;
import com.shuhendu.fullstcak.model.Course;
import com.shuhendu.fullstcak.model.Student;
import com.shuhendu.fullstcak.repository.AppUserRepository;
import com.shuhendu.fullstcak.repository.CourseRepository;
import com.shuhendu.fullstcak.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ Register student to a course with detailed conflict message
    public String registerStudentToCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course newCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        for (Course existing : student.getRegisteredCourses()) {
            if (existing.getDay().equals(newCourse.getDay())) {
                boolean isConflicting = !(existing.getEndTime().isBefore(newCourse.getStartTime()) ||
                                          existing.getStartTime().isAfter(newCourse.getEndTime()));
                if (isConflicting) {
                    return "Schedule conflict with course: " + existing.getCourseName();
                }
            }
        }

        student.getRegisteredCourses().add(newCourse);
        studentRepository.save(student);
        return "Registered successfully for " + newCourse.getCourseName();
    }

    // ✅ Get registered courses
    public List<Course> getRegisteredCourses(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return student.getRegisteredCourses();
    }

    // ✅ Unregister student from a course
    public String unregisterStudentFromCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!student.getRegisteredCourses().contains(course)) {
            throw new RuntimeException("Student is not registered for this course.");
        }

        student.getRegisteredCourses().remove(course);
        studentRepository.save(student);
        return "Unregistered successfully.";
    }

    // ✅ Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // ✅ Save new AppUser (for student registration)
    public void saveAppUser(AppUser user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    // ✅ Get course by ID (used for sending confirmation email)
    public Course getCourseById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }
}
