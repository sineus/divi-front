/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/divi.json`.
 */
export type Divi = {
  address: "4pYKM8QS4SV7ffF8bMjjPhZtQfb8R8Q5M72GbnN5oKFs";
  metadata: {
    name: "divi";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "closeVault";
      docs: [
        "Close the vault and transfert the lamports to the issuer",
        "",
        "### Parameters",
        "- `payment_id` - Unique payment ID to find vault PDA"
      ];
      discriminator: [141, 103, 17, 126, 72, 75, 29, 29];
      accounts: [
        {
          name: "issuer";
          docs: ["Payment issuer who receives the funds"];
          writable: true;
          signer: true;
        },
        {
          name: "vault";
          docs: ["Payment vault account with metadata"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 105, 118, 105, 45, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "issuer";
              },
              {
                kind: "arg";
                path: "paymentId";
              }
            ];
          };
        },
        {
          name: "vaultAuthority";
          docs: ["Vault authority - a PDA that holds the SOL funds"];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  100,
                  105,
                  118,
                  105,
                  45,
                  118,
                  97,
                  117,
                  108,
                  116,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              },
              {
                kind: "account";
                path: "issuer";
              },
              {
                kind: "arg";
                path: "paymentId";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "paymentId";
          type: "u32";
        }
      ];
    },
    {
      name: "initializeVault";
      docs: [
        "Initialize a payment vault that hosts payment infos and primary payer",
        "",
        "### Parameters",
        "- `payment_id` - Unique payment ID to find vault PDA",
        "- `total_amount` - This is the total amount that the primary payer must pay (alone or with other participants)"
      ];
      discriminator: [48, 191, 163, 44, 71, 129, 63, 164];
      accounts: [
        {
          name: "issuer";
          writable: true;
          signer: true;
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 105, 118, 105, 45, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "issuer";
              },
              {
                kind: "arg";
                path: "paymentId";
              }
            ];
          };
        },
        {
          name: "vaultAuthority";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  100,
                  105,
                  118,
                  105,
                  45,
                  118,
                  97,
                  117,
                  108,
                  116,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              },
              {
                kind: "account";
                path: "issuer";
              },
              {
                kind: "arg";
                path: "paymentId";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "paymentId";
          type: "u32";
        },
        {
          name: "totalAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "pay";
      docs: [
        "Participant pay his share",
        "",
        "### Parameters",
        "- `payment_id` - Unique payment ID to find vault PDA",
        "- `amount` - Amount to transfert"
      ];
      discriminator: [119, 18, 216, 65, 192, 117, 122, 220];
      accounts: [
        {
          name: "payer";
          writable: true;
          signer: true;
        },
        {
          name: "issuer";
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [100, 105, 118, 105, 45, 118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "issuer";
              },
              {
                kind: "arg";
                path: "paymentId";
              }
            ];
          };
        },
        {
          name: "vaultAuthority";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  100,
                  105,
                  118,
                  105,
                  45,
                  118,
                  97,
                  117,
                  108,
                  116,
                  45,
                  97,
                  117,
                  116,
                  104,
                  111,
                  114,
                  105,
                  116,
                  121
                ];
              },
              {
                kind: "account";
                path: "issuer";
              },
              {
                kind: "arg";
                path: "paymentId";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "paymentId";
          type: "u32";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "paymentVault";
      discriminator: [198, 111, 51, 64, 219, 236, 208, 239];
    }
  ];
  events: [
    {
      name: "participantPaid";
      discriminator: [233, 165, 123, 165, 246, 201, 83, 87];
    },
    {
      name: "vaultCompleted";
      discriminator: [174, 72, 181, 184, 121, 48, 107, 227];
    },
    {
      name: "vaultCreated";
      discriminator: [117, 25, 120, 254, 75, 236, 78, 115];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "stringTooLong";
      msg: "String is too long";
    },
    {
      code: 6001;
      name: "titleTooLong";
      msg: "Title is too long";
    },
    {
      code: 6002;
      name: "descriptionTooLong";
      msg: "Description is too long";
    },
    {
      code: 6003;
      name: "coverTooLong";
      msg: "Cover is too long";
    },
    {
      code: 6004;
      name: "directorTooLong";
      msg: "Director is too long";
    },
    {
      code: 6005;
      name: "tooManyActors";
      msg: "Too many actors";
    },
    {
      code: 6006;
      name: "invalidPda";
      msg: "Invalid PDA for the movie";
    },
    {
      code: 6007;
      name: "unauthorizedAccess";
      msg: "Unauthorized access, you're not the creator of this movie";
    },
    {
      code: 6008;
      name: "shareCalculationError";
      msg: "An error occurred while calculating percentage";
    },
    {
      code: 6009;
      name: "participantAlreadyPaid";
      msg: "Participant has already paid";
    },
    {
      code: 6010;
      name: "participantNotExist";
      msg: "Participant doesn't exists";
    },
    {
      code: 6011;
      name: "amountIsGreaterThanVaultTotalAmount";
      msg: "The amount is greater than the vault total amount";
    },
    {
      code: 6012;
      name: "amountIsGreaterThanRemainingVaultAmount";
      msg: "The amount is greater than the remaining vault amount";
    },
    {
      code: 6013;
      name: "invalidVaultAuthority";
      msg: "The vault issuer is invalid";
    },
    {
      code: 6014;
      name: "vaultIsAlreadyFinalized";
      msg: "Vault is already finalized";
    },
    {
      code: 6015;
      name: "vaultIsNotFinalized";
      msg: "Vault is not finalized";
    }
  ];
  types: [
    {
      name: "participantPaid";
      type: {
        kind: "struct";
        fields: [
          {
            name: "issuer";
            type: "pubkey";
          },
          {
            name: "payer";
            type: "pubkey";
          },
          {
            name: "paymentId";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "paymentVault";
      type: {
        kind: "struct";
        fields: [
          {
            name: "issuer";
            type: "pubkey";
          },
          {
            name: "totalAmount";
            type: "u64";
          },
          {
            name: "isFinalized";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "paymentId";
            type: "u32";
          },
          {
            name: "authority";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "vaultCompleted";
      type: {
        kind: "struct";
        fields: [
          {
            name: "issuer";
            type: "pubkey";
          },
          {
            name: "paymentId";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "vaultCreated";
      type: {
        kind: "struct";
        fields: [
          {
            name: "issuer";
            type: "pubkey";
          },
          {
            name: "paymentId";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    }
  ];
  constants: [
    {
      name: "vault";
      type: "string";
      value: '"divi-vault"';
    },
    {
      name: "vaultAuthority";
      type: "string";
      value: '"divi-vault-authority"';
    }
  ];
};

export const IDL: Divi = {
  address: "4pYKM8QS4SV7ffF8bMjjPhZtQfb8R8Q5M72GbnN5oKFs",
  metadata: {
    name: "divi",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "close_vault",
      docs: [
        "Close the vault and transfert the lamports to the issuer",
        "",
        "### Parameters",
        "- `payment_id` - Unique payment ID to find vault PDA",
      ],
      discriminator: [141, 103, 17, 126, 72, 75, 29, 29],
      accounts: [
        {
          name: "issuer",
          docs: ["Payment issuer who receives the funds"],
          writable: true,
          signer: true,
        },
        {
          name: "vault",
          docs: ["Payment vault account with metadata"],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [100, 105, 118, 105, 45, 118, 97, 117, 108, 116],
              },
              {
                kind: "account",
                path: "issuer",
              },
              {
                kind: "arg",
                path: "payment_id",
              },
            ],
          },
        },
        {
          name: "vault_authority",
          docs: ["Vault authority - a PDA that holds the SOL funds"],
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  100, 105, 118, 105, 45, 118, 97, 117, 108, 116, 45, 97, 117,
                  116, 104, 111, 114, 105, 116, 121,
                ],
              },
              {
                kind: "account",
                path: "issuer",
              },
              {
                kind: "arg",
                path: "payment_id",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "payment_id",
          type: "u32",
        },
      ],
    },
    {
      name: "initialize_vault",
      docs: [
        "Initialize a payment vault that hosts payment infos and primary payer",
        "",
        "### Parameters",
        "- `payment_id` - Unique payment ID to find vault PDA",
        "- `total_amount` - This is the total amount that the primary payer must pay (alone or with other participants)",
      ],
      discriminator: [48, 191, 163, 44, 71, 129, 63, 164],
      accounts: [
        {
          name: "issuer",
          writable: true,
          signer: true,
        },
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [100, 105, 118, 105, 45, 118, 97, 117, 108, 116],
              },
              {
                kind: "account",
                path: "issuer",
              },
              {
                kind: "arg",
                path: "payment_id",
              },
            ],
          },
        },
        {
          name: "vault_authority",
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  100, 105, 118, 105, 45, 118, 97, 117, 108, 116, 45, 97, 117,
                  116, 104, 111, 114, 105, 116, 121,
                ],
              },
              {
                kind: "account",
                path: "issuer",
              },
              {
                kind: "arg",
                path: "payment_id",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "payment_id",
          type: "u32",
        },
        {
          name: "total_amount",
          type: "u64",
        },
      ],
    },
    {
      name: "pay",
      docs: [
        "Participant pay his share",
        "",
        "### Parameters",
        "- `payment_id` - Unique payment ID to find vault PDA",
        "- `amount` - Amount to transfert",
      ],
      discriminator: [119, 18, 216, 65, 192, 117, 122, 220],
      accounts: [
        {
          name: "payer",
          writable: true,
          signer: true,
        },
        {
          name: "issuer",
        },
        {
          name: "vault",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [100, 105, 118, 105, 45, 118, 97, 117, 108, 116],
              },
              {
                kind: "account",
                path: "issuer",
              },
              {
                kind: "arg",
                path: "payment_id",
              },
            ],
          },
        },
        {
          name: "vault_authority",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [
                  100, 105, 118, 105, 45, 118, 97, 117, 108, 116, 45, 97, 117,
                  116, 104, 111, 114, 105, 116, 121,
                ],
              },
              {
                kind: "account",
                path: "issuer",
              },
              {
                kind: "arg",
                path: "payment_id",
              },
            ],
          },
        },
        {
          name: "system_program",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "payment_id",
          type: "u32",
        },
        {
          name: "amount",
          type: "u64",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "PaymentVault",
      discriminator: [198, 111, 51, 64, 219, 236, 208, 239],
    },
  ],
  events: [
    {
      name: "ParticipantPaid",
      discriminator: [233, 165, 123, 165, 246, 201, 83, 87],
    },
    {
      name: "VaultCompleted",
      discriminator: [174, 72, 181, 184, 121, 48, 107, 227],
    },
    {
      name: "VaultCreated",
      discriminator: [117, 25, 120, 254, 75, 236, 78, 115],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "StringTooLong",
      msg: "String is too long",
    },
    {
      code: 6001,
      name: "TitleTooLong",
      msg: "Title is too long",
    },
    {
      code: 6002,
      name: "DescriptionTooLong",
      msg: "Description is too long",
    },
    {
      code: 6003,
      name: "CoverTooLong",
      msg: "Cover is too long",
    },
    {
      code: 6004,
      name: "DirectorTooLong",
      msg: "Director is too long",
    },
    {
      code: 6005,
      name: "TooManyActors",
      msg: "Too many actors",
    },
    {
      code: 6006,
      name: "InvalidPDA",
      msg: "Invalid PDA for the movie",
    },
    {
      code: 6007,
      name: "UnauthorizedAccess",
      msg: "Unauthorized access, you're not the creator of this movie",
    },
    {
      code: 6008,
      name: "ShareCalculationError",
      msg: "An error occurred while calculating percentage",
    },
    {
      code: 6009,
      name: "ParticipantAlreadyPaid",
      msg: "Participant has already paid",
    },
    {
      code: 6010,
      name: "ParticipantNotExist",
      msg: "Participant doesn't exists",
    },
    {
      code: 6011,
      name: "AmountIsGreaterThanVaultTotalAmount",
      msg: "The amount is greater than the vault total amount",
    },
    {
      code: 6012,
      name: "AmountIsGreaterThanRemainingVaultAmount",
      msg: "The amount is greater than the remaining vault amount",
    },
    {
      code: 6013,
      name: "InvalidVaultAuthority",
      msg: "The vault issuer is invalid",
    },
    {
      code: 6014,
      name: "VaultIsAlreadyFinalized",
      msg: "Vault is already finalized",
    },
    {
      code: 6015,
      name: "VaultIsNotFinalized",
      msg: "Vault is not finalized",
    },
  ],
  types: [
    {
      name: "ParticipantPaid",
      type: {
        kind: "struct",
        fields: [
          {
            name: "issuer",
            type: "pubkey",
          },
          {
            name: "payer",
            type: "pubkey",
          },
          {
            name: "payment_id",
            type: "u32",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "PaymentVault",
      type: {
        kind: "struct",
        fields: [
          {
            name: "issuer",
            type: "pubkey",
          },
          {
            name: "total_amount",
            type: "u64",
          },
          {
            name: "is_finalized",
            type: "bool",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "payment_id",
            type: "u32",
          },
          {
            name: "authority",
            type: "pubkey",
          },
        ],
      },
    },
    {
      name: "VaultCompleted",
      type: {
        kind: "struct",
        fields: [
          {
            name: "issuer",
            type: "pubkey",
          },
          {
            name: "payment_id",
            type: "u32",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "VaultCreated",
      type: {
        kind: "struct",
        fields: [
          {
            name: "issuer",
            type: "pubkey",
          },
          {
            name: "payment_id",
            type: "u32",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
  ],
  constants: [
    {
      name: "VAULT",
      type: "string",
      value: '"divi-vault"',
    },
    {
      name: "VAULT_AUTHORITY",
      type: "string",
      value: '"divi-vault-authority"',
    },
  ],
};
