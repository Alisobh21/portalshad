import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StepValues = Record<string, unknown>;

type IconDescriptor = {
  name: string;
  size: number;
};

type WizardStep = {
  stepNo: number;
  key: string;
  label: string;
  icon: IconDescriptor;
};

type AwbLoaders = {
  getShipperAddresses: boolean;
  getConsigneeAddresses: boolean;
  calculateAwbpricing: boolean;
};

export interface AwbsState {
  wizardSteps: WizardStep[];
  returnWizardOpened: boolean;
  wizardStepsCount: number;
  wizardCurrentStep: number;
  shipperStepValues: StepValues;
  consigneeStepValues: StepValues;
  shippmentStepValues: StepValues;
  defaultReturnConsigneeOpt: string;
  orderToBeReturned: unknown;
  returnAdditionalData: unknown;
  loaders: AwbLoaders;
}

const initialLoaders: AwbLoaders = {
  getShipperAddresses: true,
  getConsigneeAddresses: true,
  calculateAwbpricing: false,
};

const initialState: AwbsState = {
  wizardSteps: [
    {
      stepNo: 1,
      key: "shipper",
      label: "Shipper Information",
      icon: { name: "PiUserCircleDashedFill", size: 18 },
    },
    {
      stepNo: 2,
      key: "consignee",
      label: "Consignee Information",
      icon: { name: "PiUserCircleDashedFill", size: 18 },
    },
    {
      stepNo: 3,
      key: "shipment",
      label: "Shipment Information",
      icon: { name: "BsFillBoxSeamFill", size: 18 },
    },
  ],
  returnWizardOpened: false,
  wizardStepsCount: 3,
  wizardCurrentStep: 1,
  shipperStepValues: {},
  consigneeStepValues: {},
  shippmentStepValues: {},
  defaultReturnConsigneeOpt: "warehouse",
  orderToBeReturned: null,
  returnAdditionalData: null,
  loaders: initialLoaders,
};

const awbsSlice = createSlice({
  name: "awbs",
  initialState,
  reducers: {
    _setCurrentStep: (state, action: PayloadAction<number>) => {
      state.wizardCurrentStep = action.payload;
    },
    _setShipperStepValue: (state, action: PayloadAction<StepValues>) => {
      state.shipperStepValues = action.payload;
    },
    _setConsigneeStepValue: (state, action: PayloadAction<StepValues>) => {
      state.consigneeStepValues = action.payload;
    },
    _setShipmentStepValue: (state, action: PayloadAction<StepValues>) => {
      state.shippmentStepValues = action.payload;
    },
    _resetWizardSteps: (state) => {
      state.wizardCurrentStep = 1;
      state.shipperStepValues = {};
      state.consigneeStepValues = {};
      state.shippmentStepValues = {};
    },
    _toggleReturnWizardOpening: (state, action: PayloadAction<boolean>) => {
      state.returnWizardOpened = action.payload;
    },
    _getOrderToBeReturned: (state, action: PayloadAction<unknown>) => {
      state.orderToBeReturned = action.payload;
    },
    _setDefConsigneeOpt: (state, action: PayloadAction<string>) => {
      state.defaultReturnConsigneeOpt = action.payload;
    },
    _resetAwbValues: (state) => {
      state.returnWizardOpened = false;
      state.wizardStepsCount = 3;
      state.wizardCurrentStep = 1;
      state.shipperStepValues = {};
      state.consigneeStepValues = {};
      state.shippmentStepValues = {};
      state.defaultReturnConsigneeOpt = "warehouse";
      state.orderToBeReturned = null;
      state.loaders = initialLoaders;
    },
    _getReturnAdditionalInfo: (state, action: PayloadAction<unknown>) => {
      state.returnAdditionalData = action.payload;
    },
  },
});

export const {
  _setCurrentStep,
  _setShipperStepValue,
  _setConsigneeStepValue,
  _setShipmentStepValue,
  _resetWizardSteps,
  _toggleReturnWizardOpening,
  _getOrderToBeReturned,
  _setDefConsigneeOpt,
  _resetAwbValues,
  _getReturnAdditionalInfo,
} = awbsSlice.actions;

export default awbsSlice.reducer;
