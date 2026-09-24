/**
 * GayaSeva Safe AI Assistant Subsystem
 * Grounded ONLY in ai_knowledge + controlled tools.
 * DRAFT-ONLY tools for createRideRequest and createServiceRequest.
 */

export interface AIDraftRequestPayload {
  isDraft: true;
  requestType: 'PICK_DROP' | 'PANDIT' | 'HOTEL' | 'GUIDE';
  formData: Record<string, any>;
  userNotice: string;
}

export class SafeAIAssistant {
  private static instance: SafeAIAssistant;

  private constructor() {}

  public static getInstance(): SafeAIAssistant {
    if (!SafeAIAssistant.instance) {
      SafeAIAssistant.instance = new SafeAIAssistant();
    }
    return SafeAIAssistant.instance;
  }

  // --- CONTROLLED BACKEND TOOLS ---

  public searchServices(category: string) {
    return [
      { id: 'srv_1', name: 'Pick & Drop Taxi Service', category: 'TRANSPORT' },
      { id: 'srv_2', name: 'Licensed Pandit Pinda Daan', category: 'PANDIT' },
      { id: 'srv_3', name: 'Verified Guest House & Hotel', category: 'HOTEL' },
    ];
  }

  public findDrivers(pickup: string, drop: string) {
    return [
      { driverId: 'drv_1', name: 'Ramesh Kumar', vehicle: 'Sedan (AC)', rating: 4.9 },
      { driverId: 'drv_2', name: 'Sunil Singh', vehicle: 'Auto E-Rickshaw', rating: 4.8 },
    ];
  }

  public findPandits(ritualType: string) {
    return [
      { panditId: 'pnd_1', name: 'Pandit Rajesh Shastri', area: 'Vishnupad', languages: ['Hindi', 'Sanskrit'] },
    ];
  }

  public findHotels(area: string) {
    return [
      { hotelId: 'htl_1', name: 'Gaya Ji Teerth Guest House', type: 'Dharamshala/Hotel', parking: true },
    ];
  }

  public getGuidePlace(placeName: string) {
    const info: Record<string, string> = {
      'vishnupad': 'Vishnupad Temple is an ancient holy temple in Gaya Ji dedicated to Lord Vishnu, featuring his 40-cm footprint stamped in solid basalt rock.',
      'falgu': 'Falgu River is the sacred river of Gaya Ji where pilgrims perform Pinda Daan rites for ancestral salvation.',
      'bodh gaya': 'Bodh Gaya is located 12 km from Gaya Ji town and is the world-renowned site where Lord Buddha attained enlightenment.',
    };
    return info[placeName.toLowerCase()] || 'Gaya Ji offers ancient sacred teerth sites, temples, and pilgrimage facilities.';
  }

  public getHelpInfo() {
    return 'GayaSeva Support Helpline: Contact verified local providers directly through the official website or admin support.';
  }

  public getProviderAvailability(providerId: string) {
    return { providerId, isAvailable: true, verifiedStatus: 'VERIFIED' };
  }

  // --- DRAFT-ONLY TOOLS (CRITICAL SAFETY REQUIREMENT) ---

  /**
   * CRITICAL: Returns a DRAFT PAYLOAD only. NEVER writes rows directly to DB tables!
   */
  public createRideRequestDraft(input: {
    pickup: string;
    drop: string;
    date: string;
    time: string;
    passengers: number;
  }): AIDraftRequestPayload {
    return {
      isDraft: true,
      requestType: 'PICK_DROP',
      formData: {
        pickupAddress: input.pickup,
        dropAddress: input.drop,
        bookingDate: input.date,
        bookingTime: input.time,
        passengerCount: input.passengers,
      },
      userNotice: 'Draft vehicle request prepared by AI Assistant. Please review and click "Submit Request" to confirm using your account.',
    };
  }

  /**
   * CRITICAL: Returns a DRAFT PAYLOAD only for general service requests.
   */
  public createServiceRequestDraft(input: {
    serviceType: 'PANDIT' | 'HOTEL' | 'GUIDE';
    details: Record<string, any>;
  }): AIDraftRequestPayload {
    return {
      isDraft: true,
      requestType: input.serviceType,
      formData: input.details,
      userNotice: `Draft ${input.serviceType} request generated. Review parameters before final submission.`,
    };
  }

  /**
   * Safe Query Evaluator enforcing guardrails against inventing official/medical/financial/religious claims
   */
  public async processQuery(prompt: string): Promise<{ text: string; draftPayload?: AIDraftRequestPayload }> {
    const lower = prompt.toLowerCase();

    // Guardrail against safety violations (inventing government/medical/official data)
    if (lower.includes('emergency number') || lower.includes('government rule') || lower.includes('medical fact')) {
      return {
        text: 'I cannot provide unverified emergency, medical, or official government regulations. Please consult official government/medical resources or use getHelpInfo().',
      };
    }

    if (lower.includes('book taxi') || lower.includes('need ride') || lower.includes('cab to')) {
      const draft = this.createRideRequestDraft({
        pickup: 'Gaya Railway Station',
        drop: 'Vishnupad Temple',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        passengers: 2,
      });
      return {
        text: 'I have prepared a draft vehicle request form for you below. Please review the details and submit when ready.',
        draftPayload: draft,
      };
    }

    if (lower.includes('pass') || lower.includes('unlock') || lower.includes('access')) {
      return {
        text: 'GayaSeva Teerth Access Passes: ₹49 Day Pass (24 hrs), ₹99 Trip Pass (7 days), ₹199 Family Pass (30 days). Unlocks directory contacts & custom trip plans.',
      };
    }

    if (lower.includes('register') || lower.includes('partner') || lower.includes('provider')) {
      return {
        text: 'Register as a Service Provider on GayaSeva for ₹49 one-time onboarding fee. Profile photo is 100% OPTIONAL (ऐच्छिक), Govt ID upload is required. Enjoy 0% commission direct bookings.',
      };
    }

    if (lower.includes('vishnupad')) {
      return { text: this.getGuidePlace('vishnupad') };
    }

    if (lower.includes('falgu')) {
      return { text: this.getGuidePlace('falgu') };
    }

    if (lower.includes('bodh gaya')) {
      return { text: this.getGuidePlace('bodh gaya') };
    }

    return { text: 'Welcome to GayaSeva Assistant! I can help you search verified local services, Pandits, Stay options, Access Passes, Provider Registration, and Gaya Ji pilgrimage guide information.' };
  }
}

export const safeAIAssistant = SafeAIAssistant.getInstance();
