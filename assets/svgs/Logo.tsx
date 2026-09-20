import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

type LogoProps = { size?: number };

/** Finora "F" logo — recreated from assets/svgs/logo.svg. */
export default function Logo({ size = 72 }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="385 170 765 750" fill="none">
      <Defs>
        <LinearGradient id="g1" gradientUnits="userSpaceOnUse" x1="450" y1="487" x2="1100" y2="230">
          <Stop offset="0" stopColor="#E8352D" />
          <Stop offset="0.35" stopColor="#FF7226" />
          <Stop offset="1" stopColor="#FF6838" />
        </LinearGradient>
        <LinearGradient id="g2" gradientUnits="userSpaceOnUse" x1="432" y1="670" x2="1000" y2="440">
          <Stop offset="0" stopColor="#E23030" />
          <Stop offset="0.45" stopColor="#FF5030" />
          <Stop offset="1" stopColor="#FF7B28" />
        </LinearGradient>
        <LinearGradient id="g3" gradientUnits="userSpaceOnUse" x1="430" y1="884" x2="640" y2="640">
          <Stop offset="0" stopColor="#FF2D42" />
          <Stop offset="0.55" stopColor="#FF5A32" />
          <Stop offset="1" stopColor="#FF6A38" />
        </LinearGradient>
      </Defs>

      <Path
        fill="url(#g1)"
        d="M730,200 L1110,200 Q1118,201 1117,209 L1082,275 C1050,322 1000,365 880,375 L690,375 C590,380 515,428 450,487 C465,400 490,330 550,270 C610,215 670,203 730,200 Z"
      />
      <Path
        fill="url(#g2)"
        d="M730,415 L1002,415 Q1012,416 1010,425 L973,490 C930,560 880,595 780,597 L640,597 C560,602 490,630 432,670 C440,590 460,530 520,475 C570,430 650,417 730,415 Z"
      />
      <Path
        fill="url(#g3)"
        d="M668,626 C560,622 470,680 435,780 C425,810 424,850 426,878 Q427,885 435,883 C540,858 620,800 655,715 C665,690 670,660 671,632 Q671,626 668,626 Z"
      />
    </Svg>
  );
}
