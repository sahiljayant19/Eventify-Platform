package com.eventify.booking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;
import com.eventify.user.User;
import com.eventify.user.UserRepository;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingController(BookingRepository bookingRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        // Get user from request
        User user = userRepository.findById(request.getUserId()).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().body(new BookingResponse("User not found", null));
        }

        Booking booking = new Booking();
        booking.setEventName(request.getEventName());
        booking.setEventMeta(request.getEventMeta());
        booking.setTickets(request.getTickets());
        booking.setPricePerTicket(request.getPricePerTicket());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setUser(user); // Assign the user

        Booking saved = bookingRepository.save(booking);

        String message = String.format(
                "Booking created for %s (%d tickets, total %.2f)",
                saved.getEventName(),
                saved.getTickets(),
                saved.getTotalAmount()
        );

        BookingResponse response = new BookingResponse(message, String.valueOf(saved.getId()));
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(@RequestParam(required = false) Long userId) {
        if (userId != null) {
            // Return bookings for specific user
            List<Booking> userBookings = bookingRepository.findByUser_Id(userId);
            return ResponseEntity.ok(userBookings);
        } else {
            // Return all bookings (fallback)
            List<Booking> bookings = bookingRepository.findAll();
            return ResponseEntity.ok(bookings);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        if (!bookingRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bookingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

