import {
    Card,
    CardHeader,
    CardSectionHeader,
    CardSubHeader,
    CardText,
    CheckBox,
    LinkButton,
    Row,
    StatusTable,
    SubmitBar
  } from "@nudmcdgnpm/digit-ui-react-components";
  import React, { useState } from "react";
  import { useTranslation } from "react-i18next";
  import { useHistory } from "react-router-dom";
  import {
    checkForNA
  } from "../../../utils";
  import Timeline from "../../../components/ADSTimeline";
  import ADSDocument from "../../../pageComponents/ADSDocument";
  import ApplicationTable from "../../../components/ApplicationTable";

/**
 * CheckPage component displays a summary of the applicant's details,
 * address information, and uploaded documents for the ADS application.
 * Users can review their inputs and confirm their declaration before 
 * submitting the application. Navigation buttons allow editing of any section.
 */


  const ActionButton = ({ jumpTo }) => {
    const { t } = useTranslation();
    const history = useHistory();
    function routeTo() {
      history.push(jumpTo);
    }
  
    return <LinkButton label={t("CS_COMMON_EDIT")} className="check-page-link-button" onClick={routeTo} />;
  };
  
  const CheckPage = ({ onSubmit, value = {} }) => {
    const { t } = useTranslation();
    const history = useHistory();
    
    const {
      applicant,
      adslist,
      index,    
      isEditADS,
      isUpdateADS,
      documents,
      address,
     
    } = value;
  
    const typeOfApplication = !isEditADS && !isUpdateADS ? `bookad` : `editbookad`;
    const columns = [
      { Header: `${t("ADS_TYPE")}`, accessor: "addType" },
      { Header: `${t("ADS_FACE_AREA")}`, accessor: "faceArea" },
      { Header: `${t("ADS_NIGHT_LIGHT")}`, accessor: "nightLight" },
      { Header: `${t("ADS_DATE")}`, accessor: "bookingDate" }
    ];
    const adslistRows = adslist?.cartDetails?.map((slot) => (
      {
        addType: slot.addType,
        faceArea:slot.faceArea,
        nightLight:slot.nightLight,
        bookingDate:slot.bookingDate,
      }
    )) || [];
    const [agree, setAgree] = useState(false);
    const setdeclarationhandler = () => {
      setAgree(!agree);
    };

    return (
      <React.Fragment>
       {window.location.href.includes("/citizen") ? <Timeline currentStep={4}/> : null}
      <Card>
        <CardHeader>{t("ADS_SUMMARY")}</CardHeader>
        <div>
        <CardText>{t("ADS_CHECK_CHECK_YOUR_ANSWERS_TEXT")}</CardText>
          <CardSubHeader style={{ fontSize: "24px" }}>{t("ADS_APPLICANT_DETAILS")}</CardSubHeader>
          <StatusTable>
          <Row
              label={t("ADS_APPLICANT_NAME")}
              text={`${t(checkForNA(applicant?.applicantName))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/applicant-details`} />}
  
          />
  
          <Row
              label={t("ADS_MOBILE_NUMBER")}
              text={`${t(checkForNA(applicant?.mobileNumber))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/applicant-details`} />}
  
          />
          <Row
              label={t("ADS_ALT_MOBILE_NUMBER")}
              text={`${t(checkForNA(applicant?.alternateNumber))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/applicant-details`} />}
  
          />
  
          <Row
              label={t("ADS_EMAIL_ID")}
              text={`${t(checkForNA(applicant?.emailId))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/applicant-details`} />}
  
          />
          </StatusTable>
          
          <CardSubHeader style={{ fontSize: "24px" }}>{t("ADS_ADDRESS_DETAILS")}</CardSubHeader>
          <StatusTable>
          <Row
              label={t("ADS_HOUSE_NO")}
              text={`${t(checkForNA(address?.houseNo))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/address-details`} />}
  
          />
          <Row
              label={t("ADS_HOUSE_NAME")}
              text={`${t(checkForNA(address?.houseName))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/address-details`} />}
  
          />
          <Row
              label={t("ADS_STREET_NAME")}
              text={`${t(checkForNA(address?.streetName))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/address-details`} />}
  
          />
          <Row
              label={t("ADS_ADDRESS_LINE1")}
              text={`${t(checkForNA(address?.addressline1))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/address-details`} />}
          />
          <Row
              label={t("ADS_ADDRESS_LINE2")}
              text={`${t(checkForNA(address?.addressline2))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/address-details`} />}
          />
           <Row
              label={t("ADS_LANDMARK")}
              text={`${t(checkForNA(address?.landmark))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/address-details`} />}
          />
           <Row
              label={t("ADS_CITY")}
              text={`${t(checkForNA(address?.city?.city?.name))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/address-details`} />}
  
          />
           <Row
              label={t("ADS_LOCALITY")}
              text={`${t(checkForNA(address?.locality?.i18nKey))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/address-details`} />}
  
          />
          <Row
              label={t("ADS_ADDRESS_PINCODE")}
              text={`${t(checkForNA(address?.pincode))}`}
              actionButton={<ActionButton jumpTo={`/digit-ui/citizen/ads/${typeOfApplication}/address-details`} />}
  
          />
          </StatusTable>
          <CardSubHeader style={{ fontSize: "24px" }}>{t("ADS_CART_DETAILS")}</CardSubHeader>
          <ApplicationTable
                t={t}
                data={adslistRows}
                columns={columns}
                getCellProps={(cellInfo) => ({
                  style: {
                    minWidth: "150px",
                    padding: "10px",
                    fontSize: "16px",
                    paddingLeft: "20px",
                  },
                })}
                isPaginationRequired={false}
                totalRecords={adslistRows.length}
              />
          <CardSubHeader style={{ fontSize: "24px" }}>{t("ADS_DOCUMENTS_DETAILS")}</CardSubHeader>
          <StatusTable>
          <Card style={{display: "flex", flexDirection: "row" }}>
            {documents && documents?.documents.map((doc, index) => (
              <div key={`doc-${index}`} style={{ marginRight: "25px"}}>
                <div>
                  <CardSectionHeader>{t("ADS_" + (doc?.documentType?.split('.').slice(0,2).join('_')))}</CardSectionHeader>
                  <ADSDocument value={value} Code={doc?.documentType} index={index} />
                </div>
              </div>
            ))}
          </Card>
          </StatusTable>
         
          <CheckBox
            label={t("ADS_FINAL_DECLARATION_MESSAGE")}
            onChange={setdeclarationhandler}
            styles={{ height: "auto" }}
            //disabled={!agree}
          />
        </div>
        <SubmitBar label={t("ADS_COMMON_BUTTON_SUBMIT")} onSubmit={onSubmit} disabled={!agree} />
      </Card>
     </React.Fragment>
    );
  };
  
  export default CheckPage;
