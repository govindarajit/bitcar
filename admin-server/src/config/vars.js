module.exports = {
  /**
   * User roles
   */
  USER_ROLES: {
    ADMIN: 'admin',
    DRIVER: 'driver',
    RIDER: 'rider',
  },
  /**
   * Driver activation status
   */
  DRIVER_ACTIVATION_STATUS: {
    ONBOARDING: 'onboarding',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    DONE: 'done',
    OTHER: 'other',
  },
  /**
   * Driving license class
   */
  DRIVING_LICENSE_CLASS: {
    A: 'A',
    A1: 'A1',
    B: 'B',
    B1: 'B1',
    B2: 'B2',
    C: 'C',
    D: 'D',
    DA: 'DA',
    E: 'E',
    E1: 'E1',
    E2: 'E2',
    F: 'F',
    G: 'G',
    H: 'H',
    I: 'I',
    M: 'M',
  },
  /**
   * Default page limit
   */
  DEFAULT_PAGE_LIMIT: 10,
  // Request state
  TRIP_STATE: {
    PENDING: 'pending',
    NO_DRIVERS_AVAILABLE: 'no_drivers_available',
    ACCEPTED: 'accepted',
    DRIVER_ARRIVED: 'driver_arrived',
    ON_THE_TRIP: 'on_the_trip',
    DRIVER_CANCELED: 'driver_canceled',
    PASSENGER_CANCELED: 'passenger_canceled',
    ADMIN_CANCELED: 'admin_canceled',
    WAIT_FOR_REIVEW: 'wait_for_review',
    COMPLETED: 'completed',
  },
  // Types of payment method
  PAYMENT_TYPE: {
    CASH: 'cash',
    VISA: 'visa',
  },
};
