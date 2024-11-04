export enum GameCategory {
  SPORTS = 1,
  SLOT = 2,
  LIVE_CASINO = 3,
  FISHING = 4,
  COCK_FIGHTING = 5,
  LOTTERY = 6,
  VIRTUAL_SPORTS = 7,
  POKER = 8,
  HOT = 9999, // Not exist at backend, custom for frontEnd `hot` category for checking maintenance
}

export enum ProviderId {
  PP = 5,
  GPI = 6,
  YGG = 8,
  SG = 10,
  PG = 14,
  CQ9 = 16,
  AT = 24,
  JILI = 32,
  MG = 34,
  NETENT = 37,
  REDTIGER = 38,
  AP = 39,
  HB = 40,
  SKYWIND = 43,
  SIMPLEPLAY = 44,
  NEXTSPIN = 50,
  ES = 49,
  IM_SPRIBE = 53,
  PLAYNGO = 54,
  FACHAI = 55,
  BNG = 57,
  NLC = 59,
  AMIGO = 60,
}

export enum ProviderTpGameTypeId {
  PP = 7,
  GPI = 11,
  YGG = 14,
  SG = 15,
  PG = 17,
  PT = 27,
  PT_NEW = 51,
  CQ9 = 29,
  AT = 39,
  JILI = 53,
  MG = 57,
  NETENT = 64,
  REDTIGER = 65,
  AP = 67,
  HB = 68,
  SKYWIND = 82,
  SIMPLEPLAY = 86,
  IM_SPRIBE = 53,
  NEXTSPIN = 99,
  ES = 98,
  PLAYNGO = 105,
  FACHAI = 106,
  BNG = 108,
  NLC = 111,
  AMIGO = 112,
}

export const slotTpGameTypeMapping: Record<
  ProviderId,
  { tpId: ProviderId; tpGameType: ProviderTpGameTypeId }
> = {
  // []: { tpId: 41, tpGameType: 4 },
  [ProviderId.PP]: { tpId: ProviderId.PP, tpGameType: ProviderTpGameTypeId.PP },
  [ProviderId.GPI]: {
    tpId: ProviderId.GPI,
    tpGameType: ProviderTpGameTypeId.GPI,
  },
  [ProviderId.YGG]: {
    tpId: ProviderId.YGG,
    tpGameType: ProviderTpGameTypeId.YGG,
  },
  [ProviderId.SG]: { tpId: ProviderId.SG, tpGameType: ProviderTpGameTypeId.SG },
  [ProviderId.PG]: { tpId: ProviderId.PG, tpGameType: ProviderTpGameTypeId.PG },
  [ProviderId.CQ9]: {
    tpId: ProviderId.CQ9,
    tpGameType: ProviderTpGameTypeId.CQ9,
  },
  [ProviderId.AT]: { tpId: ProviderId.AT, tpGameType: ProviderTpGameTypeId.AT },
  // []: { tpId: 27, tpGameType: ProviderTpGameTypeId.AP},
  [ProviderId.JILI]: {
    tpId: ProviderId.JILI,
    tpGameType: ProviderTpGameTypeId.JILI,
  },
  [ProviderId.MG]: { tpId: ProviderId.MG, tpGameType: ProviderTpGameTypeId.MG },
  [ProviderId.NETENT]: {
    tpId: ProviderId.NETENT,
    tpGameType: ProviderTpGameTypeId.NETENT,
  },
  [ProviderId.REDTIGER]: {
    tpId: ProviderId.REDTIGER,
    tpGameType: ProviderTpGameTypeId.REDTIGER,
  },
  [ProviderId.AP]: { tpId: ProviderId.AP, tpGameType: ProviderTpGameTypeId.AP },
  [ProviderId.HB]: { tpId: ProviderId.HB, tpGameType: ProviderTpGameTypeId.HB },
  [ProviderId.SKYWIND]: {
    tpId: ProviderId.SKYWIND,
    tpGameType: ProviderTpGameTypeId.SKYWIND,
  },
  [ProviderId.SIMPLEPLAY]: {
    tpId: ProviderId.SIMPLEPLAY,
    tpGameType: ProviderTpGameTypeId.SIMPLEPLAY,
  },
  [ProviderId.NEXTSPIN]: {
    tpId: ProviderId.NEXTSPIN,
    tpGameType: ProviderTpGameTypeId.NEXTSPIN,
  },
  [ProviderId.IM_SPRIBE]: {
    tpId: ProviderId.IM_SPRIBE,
    tpGameType: ProviderTpGameTypeId.IM_SPRIBE,
  },
  [ProviderId.PLAYNGO]: {
    tpId: ProviderId.PLAYNGO,
    tpGameType: ProviderTpGameTypeId.PLAYNGO,
  },
  [ProviderId.ES]: {
    tpId: ProviderId.ES,
    tpGameType: ProviderTpGameTypeId.ES,
  },
  [ProviderId.FACHAI]: {
    tpId: ProviderId.FACHAI,
    tpGameType: ProviderTpGameTypeId.FACHAI,
  },
  [ProviderId.BNG]: {
    tpId: ProviderId.BNG,
    tpGameType: ProviderTpGameTypeId.BNG,
  },
  [ProviderId.NLC]: {
    tpId: ProviderId.NLC,
    tpGameType: ProviderTpGameTypeId.NLC,
  },
  [ProviderId.AMIGO]: {
    tpId: ProviderId.AMIGO,
    tpGameType: ProviderTpGameTypeId.AMIGO,
  },
};
