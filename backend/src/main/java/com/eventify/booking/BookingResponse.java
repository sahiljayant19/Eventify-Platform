package com.eventify.booking;

public class BookingResponse {

    private String message;
    private String bookingId;

    public BookingResponse(String message, String bookingId) {
        this.message = message;
        this.bookingId = bookingId;
    }

    public String getMessage() {
        return message;
    }

    public String getBookingId() {
        return bookingId;
    }
}

