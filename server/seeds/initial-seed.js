// 'use strict';
// module.exports = {
//   up: async (migration) => {
//     const now = new Date();
//     await migration.bulkInsert('Users', [
//       {
//         id: '1',
//         name: 'tomlagier',
//         password: 'secretHash',
//         createdAt: now,
//         updatedAt: now
//       },
//       {
//         id: '2',
//         name: 'marylagier',
//         password: 'secretHash2',
//         createdAt: now,
//         updatedAt: now
//       }
//     ], {});
//     await migration.bulkInsert('Companies', [
//       {
//         id: '1',
//         name: 'invest_interval',
//         value: '100',
//         UserId: '1',
//         createdAt: now,
//         updatedAt: now
//       },
//       {
//         id: '2',
//         name: 'auto_rebalance',
//         value: 'true',
//         UserId: 1,
//         createdAt: now,
//         updatedAt: now
//       }
//     ]);
//     await migration.bulkInsert('Bots', [
//       {
//         id: '1',
//         name: 'local BTC',
//         // // address: 'abacadsf',
//         // // local: true,
//         // UserId: '1',
//         createdAt: now,
//         updatedAt: now
//       },
      
//     ]);
//     await migration.bulkInsert('UserGroups', [
//       {
//         id: '1',
//         name: 'BitCoin',
//         // code: 'BTC',
//         // active: true,
//         // portfolioWeight: 50,
//         // localAmount: '3.341',
//         // exchangeAmount: '0.023',
//         // purchaseAmount: '0.001',
//         // localWalletId: '1',
//         // exchangeWalletId: '2',
//         // UserId: '1',
//         createdAt: now,
//         updatedAt: now
//       },
//       {
//         id: '2',
//         name: 'Tether',
//         // code: 'USDT',
//         // active: true,
//         // portfolioWeight: 0,
//         // localAmount: '0',
//         // exchangeAmount: '524',
//         // purchaseAmount: '0',
//         // exchangeWalletId: '3',
//         UserId: '1',
//         createdAt: now,
//         updatedAt: now
//       }
//     ]);
//     await migration.bulkInsert('Versions', [
//       {
//         id: '1',
//         // startAmount: '500',
//         // startCoinId: '2',
//         // startWalletId: '3',
//         // endAmount: '0.153',
//         // endCoinId: '1',
//         // endWalletId: '2',
//         // UserId: '1',
//         // success: true,
//         createdAt: now,
//         updatedAt: now
//       },
//       {
//         id: '2',
//         startAmount: '500',
//         startCoinId: '2',
//         startWalletId: '3',
//         endAmount: '0.167',
//         endCoinId: '1',
//         endWalletId: '2',
//         UserId: '1',
//         success: true,
//         createdAt: now,
//         updatedAt: now
//       },
//       {
//         id: '3',
//         startAmount: '500',
//         startCoinId: '2',
//         startWalletId: '3',
//         endAmount: '0.091',
//         endCoinId: '1',
//         endWalletId: '2',
//         UserId: '1',
//         success: true,
//         createdAt: now,
//         updatedAt: now
//       },
//       {
//         id: '4',
//         startAmount: '.472',
//         startCoinId: '2',
//         startWalletId: '2',
//         endAmount: '0.091',
//         endCoinId: '2',
//         endWalletId: '1',
//         UserId: '1',
//         success: false,
//         createdAt: now,
//         updatedAt: now
//       },
//       {
//         id: '5',
//         startAmount: '.472',
//         startCoinId: '2',
//         startWalletId: '2',
//         endAmount: '0.091',
//         endCoinId: '2',
//         endWalletId: '1',
//         UserId: '1',
//         success: true,
//         createdAt: now,
//         updatedAt: now
//       },
//     ])
//   },

//   down: async (migration) => {
//     await migration.bulkDelete('Users', null, {});
//     await migration.bulkDelete('Companies', null, {});
//     await migration.bulkDelete('Bots', null, {});
//     await migration.bulkDelete('Versions', null, {});
//     await migration.bulkDelete('UserGroups', null, {});
//   }
// };