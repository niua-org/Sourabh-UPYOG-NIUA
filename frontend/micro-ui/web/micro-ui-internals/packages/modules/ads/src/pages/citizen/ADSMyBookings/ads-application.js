import { Card, KeyNote, SubmitBar, Toast } from "@nudmcdgnpm/digit-ui-react-components";
import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";

/*
 * AdsApplication component displays the details of a specific advertisement application.
 * It shows key information such as booking number, applicant name, advertisement name, 
 * booking dates, and application status. The component also includes functionality for 
 * making payments and navigating to the application details page.
 */

const AdsApplication = ({ application, tenantId, buttonLabel }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const [showToast, setShowToast] = useState(null);
//nikhil will check
  // const { data: slotSearchData, refetch } = Digit.Hooks.chb.useChbSlotSearch({
  //   tenantId: application?.tenantId,
  //   filters: {
  //     communityHallCode: application?.communityHallCode,
  //     bookingStartDate: application?.bookingSlotDetails?.[0]?.bookingDate,
  //     bookingEndDate: application?.bookingSlotDetails?.[application.bookingSlotDetails.length - 1]?.bookingDate,
  //     hallCode: application?.bookingSlotDetails?.[0]?.hallCode,
  //   },
  //   enabled: false, // Disable automatic refetch
  // });

  const getBookingDateRange = (bookingSlotDetails) => {
    if (!bookingSlotDetails || bookingSlotDetails.length === 0) {
      return t("CS_NA");
    }
    const startDate = bookingSlotDetails[0]?.bookingDate;
    const endDate = bookingSlotDetails[bookingSlotDetails.length - 1]?.bookingDate;
    if (startDate === endDate) {
      return startDate; // Return only the start date
    } else {
      // Format date range as needed, for example: "startDate - endDate"
      return startDate && endDate ? `${startDate}  -  ${endDate}` : t("CS_NA");
    }
  };
  const handleMakePayment = async () => {
    const result = await refetch();
    const isSlotBooked = result?.data?.hallSlotAvailabiltityDetails?.some((slot) => slot.slotStaus === "BOOKED");

    if (isSlotBooked) {
      setShowToast({ error: true, label: t("ADS_ADVERTISEMENT_ALREADY_BOOKED") });
    } else {
      history.push({
        pathname: `/digit-ui/citizen/payment/my-bills/${"adv-services"}/${application?.bookingNo}`,
        state: { tenantId: application?.tenantId, bookingNo: application?.bookingNo },
      });
    }
  };
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(null);
      }, 2000); // Close toast after 2 seconds

      return () => clearTimeout(timer); // Clear timer on cleanup
    }
  }, [showToast]);
  return (
    <Card>
      <KeyNote keyValue={t("ADS_BOOKING_NO")} note={application?.bookingNo} />
      <KeyNote keyValue={t("ADS_APPLICANT_NAME")} note={application?.applicantDetail?.applicantName} />
      <KeyNote keyValue={t("ADS_ADVERTISMENT_NAME")} note={t(`${application?.communityHallCode}`)} />
      <KeyNote keyValue={t("ADS_BOOKING_DATE")} note={getBookingDateRange(application?.bookingSlotDetails)} />
      <KeyNote keyValue={t("PT_COMMON_TABLE_COL_STATUS_LABEL")} note={t(`${application?.bookingStatus}`)} />
      <div>
        <Link to={`/digit-ui/citizen/ads/application/${application?.bookingNo}/${application?.tenantId}`}>
          <SubmitBar label={buttonLabel} />
        </Link>
        {application.bookingStatus !== "BOOKED" && (
          <SubmitBar label={t("CS_APPLICATION_DETAILS_MAKE_PAYMENT")} onSubmit={handleMakePayment} style={{ margin: "20px" }} />
        )}
      </div>
      {showToast && (
        <Toast
          error={showToast.error}
          warning={showToast.warning}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
    </Card>
  );
};

export default AdsApplication;
