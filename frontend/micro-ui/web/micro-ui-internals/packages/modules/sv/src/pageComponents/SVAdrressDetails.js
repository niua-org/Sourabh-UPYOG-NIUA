import React, { useEffect, useState } from "react";
import { FormStep, TextInput, CardLabel, CardHeader, Dropdown, TextArea, CheckBox } from "@nudmcdgnpm/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import Timeline from "../components/Timeline";

const SVAdrressDetails = ({ t, config, onSelect, userType, formData,editdata }) => {
  const allCities = Digit.Hooks.sv.useTenants();
  const convertToObject = (String) => String ? { i18nKey: String, code: String, value: String } : null;
  const { pathname } = useLocation();
  let validation = {};
  const user = Digit.UserService.getUser().info;
  const [pincode, setPincode] = useState(editdata?.addressDetails?.[0]?.pincode||formData?.address?.pincode || "");
  const [city, setCity] = useState(convertToObject(editdata?.addressDetails?.[0]?.city)||formData?.address?.city || "");
  const [locality, setLocality] = useState(convertToObject(editdata?.addressDetails?.[0]?.locality)||formData?.address?.locality || "");
  const [houseNo, setHouseNo] = useState(editdata?.addressDetails?.[0]?.houseNo||formData?.address?.houseNo || "");
  const [landmark, setLandmark] = useState(editdata?.addressDetails?.[0]?.landmark||formData?.address?.landmark || "");
  const [addressline1, setAddressline1] = useState(editdata?.addressDetails?.[0]?.addressLine1||formData?.address?.addressline1 || "");
  const [addressline2, setAddressline2] = useState(editdata?.addressDetails?.[0]?.addressLine2||formData?.address?.addressline2 || "");

  // states for the correspondence address input fields
  const [cpincode, setCPincode] = useState(editdata?.addressDetails?.[0]?.pincode||formData?.correspondenceAddress?.cpincode || "");
  const [ccity, setCCity] = useState(convertToObject(editdata?.addressDetails?.[0]?.city)||formData?.correspondenceAddress?.ccity || "");
  const [clocality, setCLocality] = useState(convertToObject(editdata?.addressDetails?.[0]?.locality)||formData?.correspondenceAddress?.clocality || "");
  const [chouseNo, setCHouseNo] = useState(editdata?.addressDetails?.[0]?.houseNo||formData?.correspondenceAddress?.chouseNo || "");
  const [clandmark, setCLandmark] = useState(editdata?.addressDetails?.[0]?.landmark||formData?.correspondenceAddress?.clandmark || "");
  const [caddressline1, setCAddressline1] = useState(editdata?.addressDetails?.[0]?.addressLine1||formData?.correspondenceAddress?.caddressline1 || "");
  const [caddressline2, setCAddressline2] = useState(editdata?.addressDetails?.[0]?.addressLine2||formData?.correspondenceAddress?.caddressline2 || "");
  const [isAddressSame, setIsAddressSame] = useState(formData?.correspondenceAddress?.isAddressSame || false)

  const { control } = useForm();
  const inputStyles = {width:user.type === "EMPLOYEE" ? "50%" : "86%"};

  // The hook fetches the data of localities based on the city selected
  const { data: fetchedLocalities } = Digit.Hooks.useBoundaryLocalities(
    city?.code,
    "revenue",
    {
      enabled: !!city,
    },
    t
  );
  let structuredLocality = [];
  fetchedLocalities && fetchedLocalities.map((localityData, index) => {
    structuredLocality.push({ i18nKey: localityData?.i18nkey, code: localityData?.code, label: localityData?.label, area: localityData?.area, boundaryNum: localityData?.boundaryNum })
  })


  /** The function sets the data in the corresponding address
   *  fields if "same as permanent address" checkbox is selected 
   */
  function selectChecked(e) {
    if (isAddressSame == false) {
      setIsAddressSame(true);
      setCPincode(pincode);
      setCCity(city);
      setCLocality(locality);
      setCHouseNo(houseNo);
      setCLandmark(landmark);
      setCAddressline1(addressline1);
      setCAddressline2(addressline2);
    }
    else {
      setIsAddressSame(false);
      setCPincode("");
      setCCity("");
      setCLocality("");
      setCHouseNo("");
      setCLandmark("");
      setCAddressline1("");
      setCAddressline2("");
    }
  }

  const setAddressPincode = (e) => {
    setPincode(e.target.value);
  };

  const sethouseNo = (e) => {
    setHouseNo(e.target.value);
  };

  const setlandmark = (e) => {
    setLandmark(e.target.value);
  };


  const setaddressline1 = (e) => {
    setAddressline1(e.target.value)
  }

  const setaddressline2 = (e) => {
    setAddressline2(e.target.value)
  }

  const setcAddressPincode = (e) => {
    setCPincode(e.target.value);
  };

  const setchouseNo = (e) => {
    setCHouseNo(e.target.value);
  };

  const setclandmark = (e) => {
    setCLandmark(e.target.value);
  };

  const setcaddressline1 = (e) => {
    setCAddressline1(e.target.value)
  }

  const setcaddressline2 = (e) => {
    setCAddressline2(e.target.value)
  }

  const goNext = () => {
    let owner = formData.address;
    /** Saves the data of the fields in the formdata based on if its correspondence data or not
     * Saves data with different keys
     */
    if(!pathname.includes("correspondence")){
    let ownerStep = { ...owner, pincode, city, locality, houseNo, landmark, addressline1, addressline2 };
    onSelect(config.key, { ...formData[config.key], ...ownerStep }, false);
    } else {
      owner = formData?.correspondenceAddress;
      let ownerStep = { ...owner, cpincode, ccity, clocality, chouseNo, clandmark, caddressline1, caddressline2, isAddressSame };
      onSelect(config.key, { ...formData[config.key], ...ownerStep }, false);
    }
  };


  const onSkip = () => onSelect();

  useEffect(() => {
    if (userType === "citizen") {
      goNext();
    }
  }, [pincode, city, locality, houseNo, landmark, addressline1, addressline2, ccity, chouseNo, clocality, caddressline1, caddressline2]);


  /**
   * Renders the fields for permanent address or correspondence address
   */
  if(!pathname.includes("correspondence")){
    return (
      <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={3} /> : null}
      <FormStep
        config={config}
        onSelect={goNext}
        onSkip={onSkip}
        t={t}
        isDisabled={!city || !houseNo || !locality || !addressline1 || !addressline2}
      >
        <div>
          <CardLabel>{`${t("SV_HOUSE_NO")}`} <span className="astericColor">*</span></CardLabel>
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="houseNo"
            value={houseNo}
            placeholder={"Enter House No"}
            onChange={sethouseNo}
            style={inputStyles}
            ValidationRequired={true}
            {...(validation = {
              isRequired: true,
              pattern: "^[a-zA-z0-9- ]*$",
              type: "text",
              title: t("SV_HOUSE_NO_ERROR_MESSAGE"),
            })}
          />

          <CardLabel>{`${t("SV_ADDRESS_LINE1")}`} <span className="astericColor">*</span></CardLabel>
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="addressline1"
            value={addressline1}
            placeholder={"Enter Address"}
            onChange={setaddressline1}
            style={inputStyles}
            ValidationRequired={true}
            {...(validation = {
              isRequired: false,
              pattern: "^[a-zA-Z,-/ ]*$",
              type: "textarea",
              title: t("SV_LANDMARK_ERROR_MESSAGE"),
            })}

          />

          <CardLabel>{`${t("SV_ADDRESS_LINE2")}`} <span className="astericColor">*</span></CardLabel>
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="addressline2"
            value={addressline2}
            placeholder={"Enter Address"}
            onChange={setaddressline2}
            style={inputStyles}
            ValidationRequired={true}
            {...(validation = {
              isRequired: false,
              pattern: "^[a-zA-Z,-/ ]*$",
              type: "textarea",
              title: t("SV_LANDMARK_ERROR_MESSAGE"),
            })}
          />
          <CardLabel>{`${t("SV_LANDMARK")}`}</CardLabel>
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="landmark"
            value={landmark}
            placeholder={"Enter Landmark"}
            onChange={setlandmark}
            style={inputStyles}
            ValidationRequired={true}
            {...(validation = {
              isRequired: false,
              pattern: "^[a-zA-Z,- ]*$",
              type: "text",
              title: t("SV_LANDMARK_ERROR_MESSAGE"),
            })}
          />

          <CardLabel>{`${t("SV_CITY")}`} <span className="astericColor">*</span></CardLabel>
          <Controller
            control={control}
            name={"city"}
            defaultValue={city}
            rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={city}
                select={setCity}
                option={allCities}
                optionKey="i18nKey"
                t={t}
                placeholder={"Select"}
              />
            )}
          />
          <CardLabel>{`${t("SV_LOCALITY")}`} <span className="astericColor">*</span></CardLabel>
          <Controller
            control={control}
            name={"locality"}
            defaultValue={locality}
            rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={locality}
                select={setLocality}
                option={structuredLocality}
                optionCardStyles={{ overflowY: "auto", maxHeight: "300px" }}
                optionKey="i18nKey"
                t={t}
                placeholder={"Select"}
              />
            )}
          />
          <CardLabel>{`${t("SV_ADDRESS_PINCODE")}`}</CardLabel>
          <TextInput
            t={t}
            type="tel"
            isMandatory={false}
            optionKey="i18nKey"
            name="pincode"
            value={pincode}
            onChange={setAddressPincode}
            placeholder="Enter Pincode"
            style={inputStyles}
            ValidationRequired={true}
            validation={{
              required: false,
              pattern: "^[0-9]{6}$",
              type: "tel",
              title: t("SV_ADDRESS_PINCODE_INVALID"),
            }}
            maxLength={6}
          />
        </div>
        </FormStep>
        </React.Fragment>
    );
  } else {
    return (
    <React.Fragment>
      {window.location.href.includes("/citizen") ? <Timeline currentStep={3} /> : null}
      <FormStep
        config={config}
        onSelect={goNext}
        onSkip={onSkip}
        t={t}
        isDisabled={!ccity || !chouseNo || !clocality || !caddressline1 || !caddressline2}
      >
        <div>
          {/* <CardHeader>{`${t("SV_CORRESPONDENCE_ADDRESS_HEADER")}`}</CardHeader> */}
          <CheckBox
            label={t("SV_SAME_AS_PERMANENT_ADDRESS")}
            onChange={(e) => selectChecked(e)}
            //value={field.isPrimaryOwner}
            checked={isAddressSame}
            style={{ paddingBottom: "10px", paddingTop: "10px" }}
          />

          <CardLabel>{`${t("SV_HOUSE_NO")}`} <span className="astericColor">*</span></CardLabel>
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="chouseNo"
            value={chouseNo}
            placeholder={"Enter House No"}
            onChange={setchouseNo}
            style={{ width: user.type === "EMPLOYEE" ? "50%" : "86%" }}
            ValidationRequired={false}
            {...(validation = {
              isRequired: true,
              pattern: "^[a-zA-z0-9- ]*$",
              type: "text",
              title: t("SV_HOUSE_NO_ERROR_MESSAGE"),
            })}
          />

          <CardLabel>{`${t("SV_ADDRESS_LINE1")}`} <span className="astericColor">*</span></CardLabel>
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="caddressline1"
            value={caddressline1}
            placeholder={"Enter Address"}
            onChange={setcaddressline1}
            style={{ width: user.type === "EMPLOYEE" ? "50%" : "86%" }}
            ValidationRequired={true}
            {...(validation = {
              isRequired: false,
              pattern: "^[a-zA-Z,-/ ]*$",
              type: "textarea",
              title: t("SV_LANDMARK_ERROR_MESSAGE"),
            })}

          />

          <CardLabel>{`${t("SV_ADDRESS_LINE2")}`} <span className="astericColor">*</span></CardLabel>
          <TextInput
            t={t}
            type={"text"}
            isMandatory={false}
            optionKey="i18nKey"
            name="caddressline2"
            value={caddressline2}
            placeholder={"Enter Address"}
            onChange={setcaddressline2}
            style={{ width: user.type === "EMPLOYEE" ? "50%" : "86%" }}
            ValidationRequired={true}
            {...(validation = {
              isRequired: false,
              pattern: "^[a-zA-Z,-/ ]*$",
              type: "textarea",
              title: t("SV_LANDMARK_ERROR_MESSAGE"),
            })}
          />
          <CardLabel>{`${t("SV_LANDMARK")}`}</CardLabel>
          <TextArea
            t={t}
            type={"textarea"}
            isMandatory={false}
            optionKey="i18nKey"
            name="clandmark"
            value={clandmark}
            placeholder={"Enter Landmark"}
            onChange={setclandmark}
            style={{ width: "50%" }}
            ValidationRequired={true}
            {...(validation = {
              isRequired: false,
              pattern: "^[a-zA-Z,- ]*$",
              type: "textarea",
              title: t("SV_LANDMARK_ERROR_MESSAGE"),
            })}
          />

          <CardLabel>{`${t("SV_CITY")}`} <span className="astericColor">*</span></CardLabel>
          <Controller
            control={control}
            name={"ccity"}
            defaultValue={ccity}
            rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={ccity}
                select={setCCity}
                option={allCities}
                optionKey="i18nKey"
                t={t}
                placeholder={"Select"}
              />
            )}
          />
          <CardLabel>{`${t("SV_LOCALITY")}`} <span className="astericColor">*</span></CardLabel>
          <Controller
            control={control}
            name={"clocality"}
            defaultValue={clocality}
            rules={{ required: t("CORE_COMMON_REQUIRED_ERRMSG") }}
            render={(props) => (
              <Dropdown
                className="form-field"
                selected={clocality}
                select={setCLocality}
                option={structuredLocality}
                optionCardStyles={{ overflowY: "auto", maxHeight: "300px" }}
                optionKey="i18nKey"
                t={t}
                placeholder={"Select"}
              />
            )}
          />
          <CardLabel>{`${t("SV_ADDRESS_PINCODE")}`}</CardLabel>
          <TextInput
            t={t}
            type="tel"
            isMandatory={false}
            optionKey="i18nKey"
            name="cpincode"
            value={cpincode}
            onChange={setcAddressPincode}
            placeholder="Enter Pincode"
            style={{ width: user.type === "EMPLOYEE" ? "50%" : "86%" }}
            ValidationRequired={true}
            validation={{
              required: false,
              pattern: "^[0-9]{0,6}+$",
              type: "tel",
              title: t("SV_ADDRESS_PINCODE_INVALID"),
            }}
            minLength={6}
            maxLength={6}
          />


        </div>
      </FormStep>
    </React.Fragment>
  );
}
};

export default SVAdrressDetails;


