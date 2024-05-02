import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Current time log", time);
  }, [time]);

  //login user data

  const getUserData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  //Availability
  const handleAvailability = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/booking-avaibility",
        { doctorId: params.doctorId, date, time },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        setIsAvailable(true);
        console.log(isAvailable);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Worng ");
    }
  };

  //=========== booking func
  const handleBooking = async () => {
    try {
      setIsAvailable(true);
      if (!date && !time) {
        return alert("Date & Time Required");
      }
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {doctors && (
          <div>
            <h4>
              Dr.{doctors.firstName} {doctors.lastName}
            </h4>
            <h4>Fees : {doctors.feesperConsaltation}</h4>
            <h4>
              Timings : {doctors.timings && doctors.timings[0]} -{" "}
              {doctors.timings && doctors.timings[1]}{" "}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
                aria-required={"true"}
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(_, dateString) => {
                  setDate(dateString);
                }}
              />
              <TimePicker
                aria-required={"true"}
                format="HH:mm"
                className="mt-3"
                onChange={(_, timeString) => {
                  setTime(timeString);
                }}
              />

              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>

              <button className="btn btn-dark mt-2" onClick={handleBooking}>
                Book Now
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;

// import React, { useState, useEffect } from "react";
// import Layout from "../components/Layout";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { DatePicker, message, TimePicker } from "antd";
// import moment from "moment";
// import { useDispatch, useSelector } from "react-redux";
// import { hideLoading, showLoading } from "../redux/features/alertSlice";

// const BookingPage = () => {
//   const { user } = useSelector((state) => state.user);
//   const params = useParams();
//   const [doctors, setDoctors] = useState(null); // Initialize doctors state as null
//   const [date, setDate] = useState(null); // Initialize date state as null
//   const [time, setTime] = useState(null); // Initialize time state as null
//   const [isAvailable, setIsAvailable] = useState(false);
//   const dispatch = useDispatch();

//   // Fetch doctor data by ID
//   const fetchDoctorData = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/v1/doctor/getDoctorById",
//         { doctorId: params.doctorId },
//         {
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("token"),
//           },
//         }
//       );
//       if (res.data.success) {
//         setDoctors(res.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching doctor data:", error);
//     }
//   };

//   // Check availability for booking
//   const handleAvailability = async () => {
//     try {
//       dispatch(showLoading());
//       const res = await axios.post(
//         "http://localhost:5000/api/v1/user/booking-availability",
//         { doctorId: params.doctorId, date, time }, // Send date and time in the request
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       dispatch(hideLoading());
//       if (res.data.success) {
//         setIsAvailable(true);
//         message.success(res.data.message);
//       } else {
//         message.error(res.data.message);
//       }
//     } catch (error) {
//       dispatch(hideLoading());
//       console.error("Error checking availability:", error);
//       message.error("Something went wrong");
//     }
//   };

//   // Book appointment
//   const handleBooking = async () => {
//     try {
//       dispatch(showLoading());
//       const res = await axios.post(
//         "http://localhost:5000/api/v1/user/book-appointment",
//         {
//           doctorId: params.doctorId,
//           userId: user._id,
//           doctorInfo: doctors,
//           userInfo: user,
//           date: date,
//           time: time,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       dispatch(hideLoading());
//       if (res.data.success) {
//         message.success(res.data.message);
//       }
//     } catch (error) {
//       dispatch(hideLoading());
//       console.error("Error booking appointment:", error);
//       message.error("Something went wrong");
//     }
//   };

//   useEffect(() => {
//     fetchDoctorData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <Layout>
//       <h3>Booking Page</h3>
//       <div className="container m-2">
//         {doctors && (
//           <div>
//             <h4>
//               Dr. {doctors.firstName} {doctors.lastName}
//             </h4>
//             <h4>Fees: {doctors.feesperConsaltation}</h4>
//             <h4>
//               Timings: {doctors.timings && doctors.timings[0]} -{" "}
//               {doctors.timings && doctors.timings[1]}{" "}
//             </h4>
//             <div className="d-flex flex-column w-50">
//               <DatePicker
//                 className="m-2"
//                 format="DD-MM-YYYY"
//                 onChange={(value) =>
//                   setDate(value ? moment(value).format("DD-MM-YYYY") : null)
//                 }
//               />
//               <TimePicker
//                 className="mt-3"
//                 format="HH:mm"
//                 onChange={(value) =>
//                   setTime(value ? moment(value).format("HH:mm") : null)
//                 }
//               />
//               <button
//                 className="btn btn-primary mt-2"
//                 onClick={handleAvailability}
//               >
//                 Check Availability
//               </button>
//               <button
//                 className="btn btn-dark mt-2"
//                 onClick={handleBooking}
//                 disabled={!isAvailable}
//               >
//                 Book Now
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default BookingPage;
