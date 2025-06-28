package com.shuhendu.fullstcak.controller;

import com.itextpdf.text.DocumentException;
import com.shuhendu.fullstcak.model.AppUser;
import com.shuhendu.fullstcak.model.Course;
import com.shuhendu.fullstcak.model.Student;
import com.shuhendu.fullstcak.repository.AppUserRepository;
import com.shuhendu.fullstcak.repository.StudentRepository;
import com.shuhendu.fullstcak.service.EmailService;
import com.shuhendu.fullstcak.service.StudentService;
import com.shuhendu.fullstcak.util.TimetablePdfGenerator;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // ✅ Student Registration
    @PostMapping("/register")
    public ResponseEntity<String> registerStudent(@RequestParam String fullName,
                                                   @RequestParam String email,
                                                   @RequestParam String password) {
        if (userRepository.findByUsername(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        Student student = new Student();
        student.setStudentName(fullName);
        student.setEmail(email);
        studentRepository.save(student);

        AppUser user = new AppUser();
        user.setUsername(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("STUDENT");
        userRepository.save(user);

        emailService.sendSimpleEmail(
            email,
            "Welcome to SUNY Binghamton University 🎓",
            "Hi " + fullName + ",\n\n" +
            "You have successfully registered for the SUNY Binghamton University !\n\n" +
            "Best Regards,\nSUNY Binghamton University  Team"
        );

        return ResponseEntity.ok("Student registered successfully!");
    }

    // ✅ Admin: Add Student (no password)
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    // ✅ Get All Students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // ✅ Get Student By ID
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
    }

    // ✅ Delete Student
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return "Student deleted successfully";
    }

    // ✅ Register Student to Course
    @PostMapping("/register-course/{courseId}")
    public ResponseEntity<String> registerStudentToCourse(@PathVariable Long courseId, HttpSession session) {
        AppUser user = (AppUser) session.getAttribute("user");
        if (user == null || !"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Only students can register for courses");
        }

        Student student = studentRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String result = studentService.registerStudentToCourse(student.getId(), courseId);

        Course course = studentService.getCourseById(courseId);
        emailService.sendSimpleEmail(
            student.getEmail(),
            "Course Registration Successful 🎉",
            "Hi " + student.getStudentName() + ",\n\n" +
            "You have successfully registered for the course: " + course.getCourseName() + ".\n\n" +
            "Schedule: " + course.getDay() + " from " + course.getStartTime() + " to " + course.getEndTime() + ".\n\n" +
            "Best Regards,\nSmart Class Team"
        );

        return ResponseEntity.ok(result);
    }

    // ✅ Get Registered Courses
    @GetMapping("/my-courses")
    public List<Course> getRegisteredCourses(HttpSession session) {
        AppUser user = (AppUser) session.getAttribute("user");
        if (user == null || !"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Unauthorized access");
        }

        Student student = studentRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return studentService.getRegisteredCourses(student.getId());
    }

    // ✅ Unregister Course
    @DeleteMapping("/unregister/{courseId}")
    public ResponseEntity<String> unregisterStudentFromCourse(@PathVariable Long courseId, HttpSession session) {
        AppUser user = (AppUser) session.getAttribute("user");
        if (user == null || !"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Unauthorized access");
        }

        Student student = studentRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String result = studentService.unregisterStudentFromCourse(student.getId(), courseId);
        return ResponseEntity.ok(result);
    }

    // ✅ View Available Courses
    @GetMapping("/available-courses")
    public List<Course> getAvailableCourses(HttpSession session) {
        AppUser user = (AppUser) session.getAttribute("user");
        if (user == null || !"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Unauthorized access");
        }

        Student student = studentRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Course> allCourses = studentService.getAllCourses();
        allCourses.removeAll(student.getRegisteredCourses());
        return allCourses;
    }

    // ✅ Download Timetable as PDF
    @GetMapping("/timetable/pdf")
    public ResponseEntity<byte[]> downloadTimetablePdf(HttpSession session) throws IOException {
        AppUser user = (AppUser) session.getAttribute("user");
        if (user == null || !"STUDENT".equalsIgnoreCase(user.getRole())) {
            throw new RuntimeException("Unauthorized access");
        }

        Student student = studentRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ByteArrayInputStream pdfStream = TimetablePdfGenerator.generate(student);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=timetable.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfStream.readAllBytes());
    }

    // ✅ Email Timetable as PDF Attachment
    @GetMapping("/email-timetable")
    public ResponseEntity<String> emailTimetable(HttpSession session) {
        AppUser user = (AppUser) session.getAttribute("user");
        if (user == null || !"STUDENT".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(401).body("Unauthorized access");
        }

        Student student = studentRepository.findByEmail(user.getUsername())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ByteArrayOutputStream pdfStream = TimetablePdfGenerator.generatePdfStream(student);

        emailService.sendEmailWithAttachment(
            student.getEmail(),
            "Your Timetable PDF 📄",
            "Hi " + student.getStudentName() + ",\n\nPlease find attached your registered course timetable.\n\nBest Regards,\nSmart Class Team",
            pdfStream,
            "timetable.pdf"
        );

        return ResponseEntity.ok("Timetable emailed successfully to " + student.getEmail());
    }
}
