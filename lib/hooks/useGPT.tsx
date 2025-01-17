import { useGPTContext } from '../contexts/GPTProvider';
import type {
  UseGPTProps,
  UseGPT,
  Attributes,
  PrivacySettings,
} from '../types';

const useGPT = (props?: UseGPTProps): UseGPT => {
  const { units, limitedAds } = useGPTContext();
  const setTargetingAttributes = (slotId: string, attributes: Attributes) => {
    window.googletag?.cmd.push(() => {
      const unit = units.find((unit) => unit.slotId === slotId)?.unit;
      Object.keys(attributes).forEach((tagetingKey) => {
        unit.setTargeting(tagetingKey, attributes[tagetingKey]);
      });
    });
  };

  const setPageTargetingAttributes = (attributes: Attributes) => {
    window.googletag?.cmd.push(() => {
      Object.keys(attributes).forEach((tagetingKey) => {
        window.googletag
          ?.pubads()
          .setTargeting(tagetingKey, attributes[tagetingKey]);
      });
    });
  };

  const clearTargetingAttributes = (slotId: string, attributes?: string[]) => {
    window.googletag?.cmd.push(() => {
      const unit = units.find((unit) => unit.slotId === slotId)?.unit;
      if (attributes) {
        attributes.forEach((tagetingKey) => {
          unit.clearTargeting(tagetingKey);
        });
      } else {
        unit.clearTargeting();
      }
    });
  };

  const clearPageTargetingAttributes = (attributes?: string[]) => {
    window.googletag?.cmd.push(() => {
      if (attributes) {
        attributes.forEach((tagetingKey) => {
          window.googletag?.pubads().clearTargeting(tagetingKey);
        });
      } else {
        window.googletag?.pubads().clearTargeting();
      }
    });
  };

  const setPrivacySettings = (privacySettings: Partial<PrivacySettings>) => {
    if (!limitedAds && privacySettings.limitedAds !== undefined) {
      throw new Error(
        'limited ads must be enabled on GPTContext to set privacy settings'
      );
    } else {
      window.googletag?.cmd.push(() => {
        window.googletag?.pubads().setPrivacySettings(privacySettings);
      });
    }
  };

  const refresh = (adSlots?: string[]) => {
    window.googletag?.cmd.push(() => {
      if (adSlots && adSlots.length !== 0) {
        window.googletag?.pubads().refresh(adSlots);
      } else {
        window.googletag?.pubads().refresh();
      }
    });
  };
  return {
    refresh,
    setTargetingAttributes,
    setPageTargetingAttributes,
    clearTargetingAttributes,
    clearPageTargetingAttributes,
    setPrivacySettings,
  };
};

export { useGPT };
