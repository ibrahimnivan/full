## FITUR 1

1. Event Discovery and Event Details
  Create a landing page for the website for a list of event and event details.
  • Responsiveness is a must.
  • Attendees can browse through:
                           - a list of upcoming events, 
                           - filter events based on categories or location, 
                           - and view event details, 
                           - and could buy the tickets of the events. 
                           - Don't forget to implement search bar (implement debounce is a must), 
                           - filter and pagination.
2. Event Transaction and Promotion
  2.1 Event organizers can create an event by providing details like event name, price, date, time, location, description, available seats, and ticket types (if applicable).

  2.2  Each event could be defined as free events or paid events. If the paid events are set, the attendee should be charged as the price written in the terms of the events.
  
  2.3 The one who create the event, could create a promotion contains of discount vouchers for limited persons that uses other attendees referral code, or add some discount base on dates of the event started Uses only IDR in each prices of items

3. Event Reviews and Ratings
I  3.1 The platform will include a system for event attendees to leave reviews and rate the events they have attended. After an event, attendees will have the option to provide feedback on their overall experience, the quality of the event, and any suggestions for improvement.

## FITUR 2

1. User Authentication and Authorization
1.1 For those who would like to attend the events, they must create an account in a web application first
    • There are two kind of user role in this application:
          i. Customers or participants - those who could see the list of events and buy the tickets.
          ii. Event organizer or Event Promoters those who could sell the event tickets. 
    • User could register with referral number by other users in order to get discount coupons 
    • Referral number would be generated when new user created
    • Each time another user uses someone's referral number, the one who owns the referral number would get points. This point could be redeemed in order to get a discount. 
    • Protect each page from these two kinds of roles.

2. Referral Number, Points and Prizes
-  Each time another user uses someone's referral number, the one who owns the referral number would get 10.000 points.
• Everytime point was generated, this point would expire for the next 3 months (ex: today is 28 Dec 2023 and there are 3 people using your referral number, your balance would be 30.000 and available until 28 March 2024.
Points could be redeemed to reduce the price of the tickets (ex: event tickets price is IDR 300.000 while your points balance is 20.000, you could use it and get IDR 280.000 as the final price.
Those who are register with someone referral number would get 10% discount that could be used in transactions I Discount coupon given from using someone referral code only available for the next 3 months.

3. Event Management Dashboard
• Organizers have access to a simple dashboard to view the list of their events, attendee registrations, transactions, and basic event statistics.
Statistics should be showing the information in graphs visualizations.
⚫ Shows the data in reports visualization with range per year, per month, per day