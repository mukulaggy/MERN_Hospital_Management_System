// controllers/appointmentController.js

import { Appointment } from '../models/appointmentSchema.js';
import { User } from '../models/userSchema.js';
import sendEmail from '../utils/sendEmail.js';
import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import ErrorHandler from '../middlewares/error.js';

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
  } = req.body;

  // Check if all required fields are filled
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  // Validate appointment_date
  const today = new Date();
  const appointmentDate = new Date(appointment_date);
  const maxAppointmentDate = new Date();
  maxAppointmentDate.setDate(today.getDate() + 15); // 15 days from today

  if (appointmentDate < today) {
    return next(new ErrorHandler("Appointment date cannot be before today!", 400));
  }
  if (appointmentDate > maxAppointmentDate) {
    return next(new ErrorHandler("Appointment date cannot be more than 15 days from today!", 400));
  }

  // Validate dob (date of birth)
  const dobDate = new Date(dob);
  if (dobDate > today) {
    return next(new ErrorHandler("Date of birth cannot be a future date!", 400));
  }

  // Check if the doctor exists and is unique
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }

  // Create the appointment
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstName: doctor_firstName,
      lastName: doctor_lastName,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });

  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Sent!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});

export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    const previousStatus = appointment.status;
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    // Send email notification if the appointment is accepted
    if (appointment.status === 'Accepted' && previousStatus !== 'Accepted') {
      const htmlTemplate = `
        <h1>Appointment Accepted</h1>
        <p>Dear ${appointment.firstName} ${appointment.lastName},</p>
        <p>Your appointment on ${appointment.appointment_date} has been accepted.</p>
        <p>Thank you.</p>
      `;

      sendEmail(
        appointment.email,
        'Appointment Accepted',
        `Dear ${appointment.firstName} ${appointment.lastName}, your appointment on ${appointment.appointment_date} has been accepted.`,
        htmlTemplate
      );
    }

    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});
  