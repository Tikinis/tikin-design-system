// Components.d.ts — the complete catalog of the 65 component(s) in
// Components.bundle.js. READ THIS FILE BEFORE USING THE BUNDLE: component
// names are derived from Figma layer names (sanitized to PascalCase,
// deduplicated) and may differ from what the design calls them — the
// "figma layer" comment above each interface maps them back.
// After the bundle <script> loads, every component is a window global
// (e.g. window.ActionArrow) and usable directly in JSX.
import * as React from 'react';

// figma layer: "Action arrow" (node 2:165)
export interface ActionArrowProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Android Fingerprint" (node 2:25826)
export interface AndroidFingerprintProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Arrow / Arrow_Up_MD" (node 2:127095)
export interface ArrowArrowUpMDProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "ArrowLeft" (node 2:146687)
export interface ArrowLeftProps {
  className?: string;
  style?: React.CSSProperties;
  format?: "outline" | "stroke";
  weight?: "bold" | "duotone" | "fill" | "light" | "regular" | "thin";
}

// figma layer: "ArrowSquareOut" (node 2:34557)
export interface ArrowSquareOutProps {
  className?: string;
  style?: React.CSSProperties;
  format?: "outline" | "stroke";
  weight?: "bold" | "duotone" | "fill" | "light" | "regular" | "thin";
}

// figma layer: "Bug" (node 2:34600)
export interface BugProps {
  className?: string;
  style?: React.CSSProperties;
  format?: "outline" | "stroke";
  weight?: "bold" | "duotone" | "fill" | "light" | "regular" | "thin";
}

// figma layer: "Button" (node 2:191)
export interface ButtonProps {
  className?: string;
  style?: React.CSSProperties;
  text?: string;
  iconRight?: boolean;
  variant?: "primary" | "secondary";
  iconValue?: React.ReactNode;
  state?: "default" | "disable";
  size?: "m";
}

// figma layer: "CUADRICULA ICONOGRAFIA/ mas PEQUENA para esquinas" (node 2:166958)
export interface CUADRICULAICONOGRAFIAMasPEQUENAParaProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Calendar / Arrow Button" (node 2:156649)
export interface CalendarArrowButtonProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: "next" | "previous";
  state?: "default" | "hover" | "focus" | "disabled";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Calendar / Day Button" (node 2:156688)
export interface CalendarDayButtonProps {
  className?: string;
  style?: React.CSSProperties;
  numberText?: string;
  variant?: "default" | "current" | "outside";
  state?: "default" | "hover" | "pressed" | "disabled" | "selected" | "selected (focus)";
}

// figma layer: "Calendar / Day Header" (node 2:156675)
export interface CalendarDayHeaderProps {
  className?: string;
  style?: React.CSSProperties;
  dayText?: string;
}

// figma layer: "ChartLineUp" (node 2:62704)
export interface ChartLineUpProps {
  className?: string;
  style?: React.CSSProperties;
  format?: "outline" | "stroke";
  weight?: "bold" | "duotone" | "fill" | "light" | "regular" | "thin";
}

// figma layer: "Chip" (node 2:5085)
export interface ChipProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  size?: "s" | "m" | "l" | "xs";
  feedback?: "info" | "error" | "success" | "warning";
}

// figma layer: "Component 2" (node 2:163011)
export interface Component2Props {
  className?: string;
  style?: React.CSSProperties;
  darkMode?: boolean;
  actions?: "single" | "double" | "triple";
  /** Text content; defaults to "Action". */
  text1?: string;
  /** Text content; defaults to "Action". */
  text2?: string;
  /** Text content; defaults to "Action". */
  text3?: string;
}

// figma layer: "Container" (node 2:162998)
export interface ContainerProps {
  className?: string;
  style?: React.CSSProperties;
  darkMode?: boolean;
  bottomVar?: "default" | "left" | "right";
  top?: boolean;
  bottom?: boolean;
  stack?: boolean;
}

// figma layer: "Controls/Pickers/Date and Time/Wheel/Dark/Date Picker" (node 2:156583)
export interface ControlsPickersDateAndTimeProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Dialog details" (node 2:163052)
export interface DialogDetailsProps {
  className?: string;
  style?: React.CSSProperties;
  darkMode?: boolean;
  /** Text content; defaults to "Update Available". */
  text1?: string;
  /** Text content; defaults to "There are newer version available. Update Now?". */
  text2?: string;
}

// figma layer: "Dialog master" (node 2:163059)
export interface DialogMasterProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Face ID" (node 2:25838)
export interface FaceIDProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "Face ID". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Face ID Promp / Ty Again" (node 2:25842)
export interface FaceIDPrompTyAgainProps {
  className?: string;
  style?: React.CSSProperties;
  /** Text content; defaults to "Cancel". */
  text1?: string;
  /** Text content; defaults to "Try Face ID Again". */
  text2?: string;
  /** Text content; defaults to "Try Again". */
  text3?: string;
  /** Text content; defaults to "Face ID". */
  text4?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Ghost" (node 2:5672)
export interface GhostProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  state?: "deault" | "hover" | "pressed" | "disabled";
  leftIcon?: boolean;
  size?: "xs" | "l" | "m" | "s";
  rightIcon?: boolean;
}

// figma layer: "Group 1623897755" (node 2:5096)
export interface Group1623897755Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Home bar/Pro" (node 2:79)
export interface HomeBarProProps {
  className?: string;
  style?: React.CSSProperties;
  darkMode?: "off" | "on";
}

// figma layer: "iPhone X, 11 Pro / Black" (node 2:22)
export interface IPhoneX11ProBlackProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "iPhone X, 11 Pro / White" (node 2:44)
export interface IPhoneX11ProWhiteProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "icon" (node 2:84)
export interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  icon?: "delete" | "arrow up" | "at @" | "slash" | "emoji" | "enter" | "dot" | "tel" | "emoji filled" | "arrow up filled" | "language" | "dictation" | "dictation filled" | "siri";
}

// figma layer: "Icon / ChevronDown" (node 2:156622)
export interface IconChevronDownProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Icon / ChevronLeft" (node 2:156632)
export interface IconChevronLeftProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Icon / ChevronRight" (node 2:156647)
export interface IconChevronRightProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Icon / Face ID" (node 2:25814)
export interface IconFaceIDProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Icon / Face ID" (node 2:25828)
export interface IconFaceID2Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Key/Go" (node 2:5572)
export interface KeyGoProps {
  className?: string;
  style?: React.CSSProperties;
  active?: "on" | "off";
  dark?: "off" | "on";
  /** Text content; defaults to "go". */
  text1?: string;
}

// figma layer: "Key/Letter" (node 2:5328)
export interface KeyLetterProps {
  className?: string;
  style?: React.CSSProperties;
  lowercase?: "on" | "off";
  dark?: "on" | "off";
  /** Text content; defaults to "Q". */
  text1?: string;
}

// figma layer: "Key/Num" (node 2:47)
export interface KeyNumProps {
  className?: string;
  style?: React.CSSProperties;
  abc?: "on" | "off";
  dark?: "off" | "on";
  /** Text content; defaults to "2". */
  text1?: string;
}

// figma layer: "Key/Number" (node 2:58)
export interface KeyNumberProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "decimal" | "tel" | "placeholder";
  dark?: "off" | "on";
}

// figma layer: "Key/Primary" (node 2:5567)
export interface KeyPrimaryProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: "off" | "on";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Key/Remove" (node 2:68)
export interface KeyRemoveProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: "off" | "on";
}

// figma layer: "Key/Return" (node 2:5558)
export interface KeyReturnProps {
  className?: string;
  style?: React.CSSProperties;
  icon?: "off" | "on";
  dark?: "off" | "on";
  /** Text content; defaults to "return". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Key/Secondary" (node 2:5347)
export interface KeySecondaryProps {
  className?: string;
  style?: React.CSSProperties;
  icon?: "on" | "off";
  dark?: "off" | "on";
  /** Text content; defaults to "123". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Key/Shift" (node 2:5338)
export interface KeyShiftProps {
  className?: string;
  style?: React.CSSProperties;
  lowercase?: "off" | "on";
  dark?: "off" | "on";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Key/Space" (node 2:5553)
export interface KeySpaceProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: "on" | "off";
  /** Text content; defaults to "space". */
  text1?: string;
}

// figma layer: "Keyboard/Default" (node 2:5642)
export interface KeyboardDefaultProps {
  className?: string;
  style?: React.CSSProperties;
  option?: boolean;
  dark?: "off" | "on";
  suggestion?: boolean;
}

// figma layer: "Keyboard/Home Bar" (node 2:114)
export interface KeyboardHomeBarProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: "off" | "on";
  iconLeft?: boolean;
  iconRight?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
}

// figma layer: "Keyboard/Input Type" (node 2:5581)
export interface KeyboardInputTypeProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "search" | "text" | "e-mail" | "url" | "emoji";
  dark?: "on" | "off";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon3?: React.ReactNode;
}

// figma layer: "Keyboard/Layout" (node 2:5356)
export interface KeyboardLayoutProps {
  className?: string;
  style?: React.CSSProperties;
  layout?: "ABC" | "abc" | "123";
  dark?: "off" | "on";
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon2?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon3?: React.ReactNode;
  /** Swappable nested instance; defaults to the design's. */
  icon4?: React.ReactNode;
}

// figma layer: "Keyboard/Numpad" (node 2:124)
export interface KeyboardNumpadProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: "off" | "on";
}

// figma layer: "Keyboard/Option" (node 2:5281)
export interface KeyboardOptionProps {
  className?: string;
  style?: React.CSSProperties;
  dark?: boolean;
  /** Text content; defaults to "Done". */
  text1?: string;
}

// figma layer: "Keyboard/Suggestion" (node 2:5290)
export interface KeyboardSuggestionProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "password" | "text" | "messages";
  dark?: "on" | "off";
  /** Text content; defaults to "Passwords". */
  text1?: string;
  /** Text content; defaults to "123456". */
  text2?: string;
  /** Text content; defaults to "Ok". */
  text3?: string;
}

// figma layer: "Link" (node 2:135138)
export interface LinkProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  state?: "deault" | "disabled" | "hover" | "pressed";
  size?: "s" | "l" | "m" | "xs";
  /** Text content; defaults to "Label". */
  text1?: string;
}

// figma layer: "Liquid Toggle" (node 2:34537)
export interface LiquidToggleProps {
  className?: string;
  style?: React.CSSProperties;
  property1?: "default" | "default 2" | "default 3" | "enabled" | "enabled 2" | "enabled 3";
}

// figma layer: "Null" (node 2:173)
export interface NullProps {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Plus" (node 2:34716)
export interface PlusProps {
  className?: string;
  style?: React.CSSProperties;
  format?: "outline" | "stroke";
  weight?: "bold" | "duotone" | "fill" | "light" | "regular" | "thin";
}

// figma layer: "Primary" (node 2:378)
export interface PrimaryProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  leftIcon?: boolean;
  state?: "default" | "hover" | "pressed" | "loading" | "disabled";
  size?: "xs" | "s" | "m" | "l";
  rightIcon?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Primary" (node 2:135125)
export interface Primary2Props {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  leftIcon?: boolean;
  state?: "default" | "loading" | "disabled" | "hover" | "pressed";
  size?: "m" | "l" | "s" | "xs";
  rightIcon?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "reservation-type" (node 2:52322)
export interface ReservationTypeProps {
  className?: string;
  style?: React.CSSProperties;
  type?: "phone call" | "online" | "location";
  /** Text content; defaults to "Phone call". */
  text1?: string;
}

// figma layer: "Secondary" (node 2:2)
export interface SecondaryProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  leftIcon?: boolean;
  state?: "default" | "pressed" | "disabled" | "hover" | "loading";
  size?: "xs" | "l" | "m" | "s";
  rightIcon?: boolean;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "SignIn" (node 2:34673)
export interface SignInProps {
  className?: string;
  style?: React.CSSProperties;
  format?: "outline" | "stroke";
  weight?: "bold" | "duotone" | "fill" | "light" | "regular" | "thin";
}

// figma layer: "32х32/Stroked/Down" (node 2:127098)
export interface StrokedDown3232Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "32х32/Stroked/Select" (node 2:84563)
export interface StrokedSelect3232Props {
  className?: string;
  style?: React.CSSProperties;
}

// figma layer: "Switch" (node 2:62618)
export interface SwitchProps {
  className?: string;
  style?: React.CSSProperties;
  size?: "sm" | "md" | "lg";
  status?: "on" | "off";
  copy?: boolean;
  title?: boolean;
  /** Text content; defaults to "Title text goes here". */
  text1?: string;
  /** Text content; defaults to "Secondary text line goes here ". */
  text2?: string;
}

// figma layer: "tab item" (node 2:84571)
export interface TabItemProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "selected" | "unselected";
  /** Text content; defaults to "Selected". */
  text1?: string;
}

// figma layer: "TextField" (node 2:5155)
export interface TextFieldProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  state?: "deafult" | "pressed" | "active" | "disabled";
  placeholder?: string;
  feedback?: "default" | "success" | "error";
  error?: string;
  showIcon?: boolean;
  size?: "xs" | "s" | "m" | "l";
  /** Text content; defaults to "|". */
  text1?: string;
  /** Swappable nested instance; defaults to the design's. */
  icon1?: React.ReactNode;
}

// figma layer: "Toggle" (node 2:13)
export interface ToggleProps {
  className?: string;
  style?: React.CSSProperties;
  state?: "default" | "disabled";
  size?: "l" | "m" | "s" | "xs";
  active?: "on" | "off";
}

// figma layer: "Value" (node 2:228)
export interface ValueProps {
  className?: string;
  style?: React.CSSProperties;
  value?: "arrowdown" | "arrowleft" | "arrowright" | "arrowup" | "arrowupleft" | "arrowupright" | "bell" | "briefcase" | "close" | "downloadsimple" | "eye" | "eyeclosed" | "headset" | "house" | "mathoperations" | "qrcode" | "questionmark" | "copy" | "heart" | "chevronleft" | "chevrondown" | "chevronup" | "chevronright" | "spinner" | "warning" | "warningcircle";
}

// figma layer: "Value" (node 2:296)
export interface Value2Props {
  className?: string;
  style?: React.CSSProperties;
  value?: "arrowdown" | "arrowleft" | "arrowright" | "arrowup" | "arrowupleft" | "arrowupright" | "bell" | "briefcase" | "close" | "downloadsimple" | "eye" | "eyeclosed" | "headset" | "house" | "mathoperations" | "qrcode" | "questionmark" | "copy" | "heart" | "chevronleft" | "chevrondown" | "chevronup" | "chevronright" | "spinner";
}

declare const ActionArrow: React.FC<ActionArrowProps>;
declare const AndroidFingerprint: React.FC<AndroidFingerprintProps>;
declare const ArrowArrowUpMD: React.FC<ArrowArrowUpMDProps>;
declare const ArrowLeft: React.FC<ArrowLeftProps>;
declare const ArrowSquareOut: React.FC<ArrowSquareOutProps>;
declare const Bug: React.FC<BugProps>;
declare const Button: React.FC<ButtonProps>;
declare const CUADRICULAICONOGRAFIAMasPEQUENAPara: React.FC<CUADRICULAICONOGRAFIAMasPEQUENAParaProps>;
declare const CalendarArrowButton: React.FC<CalendarArrowButtonProps>;
declare const CalendarDayButton: React.FC<CalendarDayButtonProps>;
declare const CalendarDayHeader: React.FC<CalendarDayHeaderProps>;
declare const ChartLineUp: React.FC<ChartLineUpProps>;
declare const Chip: React.FC<ChipProps>;
declare const Component2: React.FC<Component2Props>;
declare const Container: React.FC<ContainerProps>;
declare const ControlsPickersDateAndTime: React.FC<ControlsPickersDateAndTimeProps>;
declare const DialogDetails: React.FC<DialogDetailsProps>;
declare const DialogMaster: React.FC<DialogMasterProps>;
declare const FaceID: React.FC<FaceIDProps>;
declare const FaceIDPrompTyAgain: React.FC<FaceIDPrompTyAgainProps>;
declare const Ghost: React.FC<GhostProps>;
declare const Group1623897755: React.FC<Group1623897755Props>;
declare const HomeBarPro: React.FC<HomeBarProProps>;
declare const IPhoneX11ProBlack: React.FC<IPhoneX11ProBlackProps>;
declare const IPhoneX11ProWhite: React.FC<IPhoneX11ProWhiteProps>;
declare const Icon: React.FC<IconProps>;
declare const IconChevronDown: React.FC<IconChevronDownProps>;
declare const IconChevronLeft: React.FC<IconChevronLeftProps>;
declare const IconChevronRight: React.FC<IconChevronRightProps>;
declare const IconFaceID: React.FC<IconFaceIDProps>;
declare const IconFaceID2: React.FC<IconFaceID2Props>;
declare const KeyGo: React.FC<KeyGoProps>;
declare const KeyLetter: React.FC<KeyLetterProps>;
declare const KeyNum: React.FC<KeyNumProps>;
declare const KeyNumber: React.FC<KeyNumberProps>;
declare const KeyPrimary: React.FC<KeyPrimaryProps>;
declare const KeyRemove: React.FC<KeyRemoveProps>;
declare const KeyReturn: React.FC<KeyReturnProps>;
declare const KeySecondary: React.FC<KeySecondaryProps>;
declare const KeyShift: React.FC<KeyShiftProps>;
declare const KeySpace: React.FC<KeySpaceProps>;
declare const KeyboardDefault: React.FC<KeyboardDefaultProps>;
declare const KeyboardHomeBar: React.FC<KeyboardHomeBarProps>;
declare const KeyboardInputType: React.FC<KeyboardInputTypeProps>;
declare const KeyboardLayout: React.FC<KeyboardLayoutProps>;
declare const KeyboardNumpad: React.FC<KeyboardNumpadProps>;
declare const KeyboardOption: React.FC<KeyboardOptionProps>;
declare const KeyboardSuggestion: React.FC<KeyboardSuggestionProps>;
declare const Link: React.FC<LinkProps>;
declare const LiquidToggle: React.FC<LiquidToggleProps>;
declare const Null: React.FC<NullProps>;
declare const Plus: React.FC<PlusProps>;
declare const Primary: React.FC<PrimaryProps>;
declare const Primary2: React.FC<Primary2Props>;
declare const ReservationType: React.FC<ReservationTypeProps>;
declare const Secondary: React.FC<SecondaryProps>;
declare const SignIn: React.FC<SignInProps>;
declare const StrokedDown3232: React.FC<StrokedDown3232Props>;
declare const StrokedSelect3232: React.FC<StrokedSelect3232Props>;
declare const Switch: React.FC<SwitchProps>;
declare const TabItem: React.FC<TabItemProps>;
declare const TextField: React.FC<TextFieldProps>;
declare const Toggle: React.FC<ToggleProps>;
declare const Value: React.FC<ValueProps>;
declare const Value2: React.FC<Value2Props>;
declare global {
  interface Window {
    ActionArrow: React.FC<ActionArrowProps>;
    AndroidFingerprint: React.FC<AndroidFingerprintProps>;
    ArrowArrowUpMD: React.FC<ArrowArrowUpMDProps>;
    ArrowLeft: React.FC<ArrowLeftProps>;
    ArrowSquareOut: React.FC<ArrowSquareOutProps>;
    Bug: React.FC<BugProps>;
    Button: React.FC<ButtonProps>;
    CUADRICULAICONOGRAFIAMasPEQUENAPara: React.FC<CUADRICULAICONOGRAFIAMasPEQUENAParaProps>;
    CalendarArrowButton: React.FC<CalendarArrowButtonProps>;
    CalendarDayButton: React.FC<CalendarDayButtonProps>;
    CalendarDayHeader: React.FC<CalendarDayHeaderProps>;
    ChartLineUp: React.FC<ChartLineUpProps>;
    Chip: React.FC<ChipProps>;
    Component2: React.FC<Component2Props>;
    Container: React.FC<ContainerProps>;
    ControlsPickersDateAndTime: React.FC<ControlsPickersDateAndTimeProps>;
    DialogDetails: React.FC<DialogDetailsProps>;
    DialogMaster: React.FC<DialogMasterProps>;
    FaceID: React.FC<FaceIDProps>;
    FaceIDPrompTyAgain: React.FC<FaceIDPrompTyAgainProps>;
    Ghost: React.FC<GhostProps>;
    Group1623897755: React.FC<Group1623897755Props>;
    HomeBarPro: React.FC<HomeBarProProps>;
    IPhoneX11ProBlack: React.FC<IPhoneX11ProBlackProps>;
    IPhoneX11ProWhite: React.FC<IPhoneX11ProWhiteProps>;
    Icon: React.FC<IconProps>;
    IconChevronDown: React.FC<IconChevronDownProps>;
    IconChevronLeft: React.FC<IconChevronLeftProps>;
    IconChevronRight: React.FC<IconChevronRightProps>;
    IconFaceID: React.FC<IconFaceIDProps>;
    IconFaceID2: React.FC<IconFaceID2Props>;
    KeyGo: React.FC<KeyGoProps>;
    KeyLetter: React.FC<KeyLetterProps>;
    KeyNum: React.FC<KeyNumProps>;
    KeyNumber: React.FC<KeyNumberProps>;
    KeyPrimary: React.FC<KeyPrimaryProps>;
    KeyRemove: React.FC<KeyRemoveProps>;
    KeyReturn: React.FC<KeyReturnProps>;
    KeySecondary: React.FC<KeySecondaryProps>;
    KeyShift: React.FC<KeyShiftProps>;
    KeySpace: React.FC<KeySpaceProps>;
    KeyboardDefault: React.FC<KeyboardDefaultProps>;
    KeyboardHomeBar: React.FC<KeyboardHomeBarProps>;
    KeyboardInputType: React.FC<KeyboardInputTypeProps>;
    KeyboardLayout: React.FC<KeyboardLayoutProps>;
    KeyboardNumpad: React.FC<KeyboardNumpadProps>;
    KeyboardOption: React.FC<KeyboardOptionProps>;
    KeyboardSuggestion: React.FC<KeyboardSuggestionProps>;
    Link: React.FC<LinkProps>;
    LiquidToggle: React.FC<LiquidToggleProps>;
    Null: React.FC<NullProps>;
    Plus: React.FC<PlusProps>;
    Primary: React.FC<PrimaryProps>;
    Primary2: React.FC<Primary2Props>;
    ReservationType: React.FC<ReservationTypeProps>;
    Secondary: React.FC<SecondaryProps>;
    SignIn: React.FC<SignInProps>;
    StrokedDown3232: React.FC<StrokedDown3232Props>;
    StrokedSelect3232: React.FC<StrokedSelect3232Props>;
    Switch: React.FC<SwitchProps>;
    TabItem: React.FC<TabItemProps>;
    TextField: React.FC<TextFieldProps>;
    Toggle: React.FC<ToggleProps>;
    Value: React.FC<ValueProps>;
    Value2: React.FC<Value2Props>;
  }
}
