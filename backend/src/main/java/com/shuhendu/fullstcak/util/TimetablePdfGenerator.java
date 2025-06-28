package com.shuhendu.fullstcak.util;
import com.shuhendu.fullstcak.model.Student;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import com.shuhendu.fullstcak.model.Course;


import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Stream;

public class TimetablePdfGenerator {

    // Used for direct PDF download (already working)
    public static ByteArrayInputStream generate(Student student) {
        return new ByteArrayInputStream(generatePdfStream(student).toByteArray());
    }

    // NEW: Used for email attachment
    public static ByteArrayOutputStream generatePdfStream(Student student) {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Paragraph title = new Paragraph("Student Timetable", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" "));

            // Student Info
            Font infoFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            document.add(new Paragraph("Name: " + student.getStudentName(), infoFont));
            document.add(new Paragraph("Email: " + student.getEmail(), infoFont));
            document.add(new Paragraph(" "));

            // Table
            PdfPTable table = new PdfPTable(5);
            Stream.of("Course", "Instructor", "Day", "Start Time", "End Time")
                  .forEach(header -> {
                      PdfPCell cell = new PdfPCell(new Phrase(header));
                      cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                      table.addCell(cell);
                  });

            List<Course> courses = student.getRegisteredCourses();
            for (Course c : courses) {
                table.addCell(c.getCourseName());
                table.addCell(c.getInstructor());
                table.addCell(c.getDay());
                table.addCell(c.getStartTime().toString());
                table.addCell(c.getEndTime().toString());
            }

            document.add(table);
            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out;
    }
}
