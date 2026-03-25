package com.eventify.booking;

public class BookingRequest {

    private String eventName;
    private String eventMeta;
    private int tickets;
    private double pricePerTicket;
    private double totalAmount;
    private Long userId; // Add user ID field

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventMeta() {
        return eventMeta;
    }

    public void setEventMeta(String eventMeta) {
        this.eventMeta = eventMeta;
    }

    public int getTickets() {
        return tickets;
    }

    public void setTickets(int tickets) {
        this.tickets = tickets;
    }

    public double getPricePerTicket() {
        return pricePerTicket;
    }

    public void setPricePerTicket(double pricePerTicket) {
        this.pricePerTicket = pricePerTicket;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

