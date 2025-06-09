import { useRef, useState } from "react";

type CompositionBarProps = {
  composition: {
    meat: number;
    bone: number;
    organ: number;
  };
};

export const CompositionBar = ({ composition }: CompositionBarProps) => {
  const [ratios, setRatios] = useState({
    meat:
      composition.meat /
      (composition.meat + composition.bone + composition.organ),
    bone:
      composition.bone /
      (composition.meat + composition.bone + composition.organ),
    organ:
      composition.organ /
      (composition.meat + composition.bone + composition.organ),
  });

    
  return (
    <div className="flex flex-col gap-2 min-w-20 w-full">
      <div className="flex gap-2 justify-center items-center text-xs text-gray-500">
        {composition.meat > 0 && <div className="text-rose-500">Meat {Math.round(ratios.meat * 100)}%</div>}
        {composition.bone > 0 && <div className="text-orange-500 dark:text-amber-500">Bone {Math.round(ratios.bone * 100)}%</div>}
        {composition.organ > 0 && <div className="text-emerald-500">Organ {Math.round(ratios.organ * 100)}%</div>}
      </div>
      <div className="flex rounded-full bg-gray-200 dark:bg-gray-700 h-4 overflow-hidden">
        <div
          className="bg-rose-500 dark:bg-rose-500 h-full"
          style={{ width: `${ratios.meat * 100}%` }}
        ></div>
        <div
          className="bg-amber-500 dark:bg-amber-500 h-full"
          style={{ width: `${ratios.bone * 100}%` }}
        ></div>
        <div
          className="bg-emerald-500 dark:bg-emerald-500 h-full"
          style={{ width: `${ratios.organ * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
