import { Editor } from "@/components/editor/DynamicEditor";

export default async function Page() {
  const content = [
    {
      "id": "a104c8e8-284d-44b2-a155-c23fd5eea1be",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 1
      },
      "content": [
        {
          "type": "text",
          "text": "Documentation",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "d40ec9f1-5a53-4ac0-a531-38ebce57dc6a",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [],
      "children": []
    },
    {
      "id": "544a1f78-1f82-4a6f-a852-e0cafccb02a7",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Bienvenue dans ",
          "styles": {}
        },
        {
          "type": "text",
          "text": "TD Editor",
          "styles": {
            "bold": true
          }
        },
        {
          "type": "text",
          "text": ", l'outil ultime pour la création et l'édition de sujets de travaux dirigés. Que vous soyez enseignant ou étudiant, notre plateforme vous permet de structurer vos documents avec facilité et de les exporter en PDF.",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "24d0bf0e-4f79-4223-ac87-f84547128408",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [],
      "children": []
    },
    {
      "id": "ca1e149a-e426-4bc6-b72d-90913907406a",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "Fonctionnalités principales",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "fa4c1017-7876-4305-a7e3-13f9729d523f",
      "type": "bulletListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Génération automatique",
          "styles": {
            "bold": true
          }
        },
        {
          "type": "text",
          "text": " : Parsez un fichier existant pour extraire son contenu et le structurer automatiquement.",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "b6ff2557-8507-42fe-85e8-37f70738928d",
      "type": "bulletListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Editeur interactif",
          "styles": {
            "bold": true
          }
        },
        {
          "type": "text",
          "text": " : Ajoutez des cases à cocher, des zones de texte et d'autres composants interactifs.",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "353a3bb5-1710-4e75-bc1b-5fc1da7c3b41",
      "type": "bulletListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Exportation flexible",
          "styles": {
            "bold": true
          }
        },
        {
          "type": "text",
          "text": " : Convertissez vos documents en PDF avec différents styles et mises en page.",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "25ce4bcf-44c9-4445-b41e-2619245a8e14",
      "type": "bulletListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Collaboration en temps réel",
          "styles": {
            "bold": true
          }
        },
        {
          "type": "text",
          "text": " ",
          "styles": {}
        },
        {
          "type": "text",
          "text": "(bientôt disponible)",
          "styles": {
            "italic": true
          }
        },
        {
          "type": "text",
          "text": " : Travaillez à plusieurs sur le même sujet.",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "623e0242-fcfe-4303-8c8a-58ba95448b6f",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [],
      "children": []
    },
    {
      "id": "e5ceccee-b48c-47e8-9d14-8cc8c65ae19e",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "Prise en main",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "f9590395-a832-4df6-b7d7-07b9607bbd44",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [],
      "children": []
    },
    {
      "id": "1f22ab89-0a8c-422a-bc38-143dd9d5e228",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "1. Création d'un nouveau projet",
          "styles": {}
        }
      ],
      "children": [
        {
          "id": "709bcf72-341a-4b0a-ac9b-be5e39d3cc76",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Rendez-vous sur la page d'accueil. ",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "a4a3003b-46bf-4a70-a52a-36ef0f362dde",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Cliquez sur ",
              "styles": {}
            },
            {
              "type": "text",
              "text": "\"Nouveau projet\"",
              "styles": {
                "bold": true
              }
            },
            {
              "type": "text",
              "text": ".",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "a776c0a1-184d-42fb-8089-38e8ca616c55",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Indiquez un titre et une description.",
              "styles": {}
            }
          ],
          "children": []
        }
      ]
    },
    {
      "id": "74cdf7fc-cee4-4970-b5f5-6885d3dd690d",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [],
      "children": []
    },
    {
      "id": "6270d791-3ca1-4e9f-9341-f62070a18f4e",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "2. Importation d'un sujet existant",
          "styles": {}
        }
      ],
      "children": [
        {
          "id": "6f0313f7-427a-43ad-985c-bde640979ae9",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Depuis un projet, cliquez sur ",
              "styles": {}
            },
            {
              "type": "text",
              "text": "\"Importer un fichier\"",
              "styles": {
                "bold": true
              }
            },
            {
              "type": "text",
              "text": ".",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "e8c5f74d-156e-4308-bd43-59eddcbb55b4",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Uploadez un fichier PDF ou texte.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "ed2a5a64-bea6-4809-a684-cc1a1c0cfdfe",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "L'IA analysera le document et proposera un format pré-rempli.",
              "styles": {}
            }
          ],
          "children": []
        }
      ]
    },
    {
      "id": "6fcef989-a2f1-49eb-9855-b6d24784c407",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [],
      "children": []
    },
    {
      "id": "5e21b867-a5b3-4fac-8c17-bc627a9c6732",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "3. Modification et personnalisation",
          "styles": {}
        }
      ],
      "children": [
        {
          "id": "c32188b1-1bcd-4bfe-a6a0-52168947d548",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Utilisez l'éditeur pour ajuster les questions et les réponses.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "c5abf727-bf4a-490b-b6ee-4e3d1d7e975d",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Ajoutez des éléments interactifs.",
              "styles": {}
            }
          ],
          "children": []
        },
        {
          "id": "27772c75-c7ad-456d-9018-f4f5a5bac671",
          "type": "numberedListItem",
          "props": {
            "textColor": "default",
            "backgroundColor": "default",
            "textAlignment": "left"
          },
          "content": [
            {
              "type": "text",
              "text": "Prévisualisez votre document avant exportation.",
              "styles": {}
            }
          ],
          "children": []
        }
      ]
    },
    {
      "id": "e15eba17-00a8-4038-b3ad-b96edefa77c6",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "4. Exportation en PDF",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "785eae24-3a70-465d-ab11-4898bea0ec00",
      "type": "numberedListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Cliquez sur ",
          "styles": {}
        },
        {
          "type": "text",
          "text": "\"Exporter\"",
          "styles": {
            "bold": true
          }
        },
        {
          "type": "text",
          "text": ".",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "76fda801-cbdb-4711-8053-da4aa7239767",
      "type": "numberedListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Choisissez votre format de mise en page.",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "bc2f797f-35a5-4702-bd5c-2ccf34a3aa21",
      "type": "numberedListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Téléchargez votre fichier final.",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "206f17d5-89bb-428e-ac83-cfc684f6555d",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "Configuration avancée",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "905b01ed-05ff-44d6-8db9-75d317bea9db",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Formats supportés",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "59ca0284-b645-4ff6-bd9c-7c11313b58c1",
      "type": "bulletListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Import",
          "styles": {
            "bold": true
          }
        },
        {
          "type": "text",
          "text": " : PDF, TXT",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "c3f6815b-0813-40c0-92fe-c9ccdb25592d",
      "type": "bulletListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Export",
          "styles": {
            "bold": true
          }
        },
        {
          "type": "text",
          "text": " : PDF",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "92f1492d-3910-43d9-a94d-f05978124382",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Options de personnalisation",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "15c4f9ee-357a-455b-84f9-48dd3e85d0bb",
      "type": "bulletListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Mode sombre",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "ba5d4cd4-76ac-46dc-88f4-c1917147b92c",
      "type": "bulletListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Police et taille du texte ajustables",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "994badc7-c50e-4c96-a635-d7665e67160c",
      "type": "bulletListItem",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Ajout de logos et d'entêtes personnalisées",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "f8443363-facf-4200-baeb-e6cc62b27685",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 2
      },
      "content": [
        {
          "type": "text",
          "text": "FAQ",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "a250518a-f785-4402-bf9c-91793937372b",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Q : Mon fichier PDF ne s'importe pas correctement. Que faire ?",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "42975232-b21b-4204-83f7-a89a92c374f5",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Vérifiez que votre document est bien structuré et ne contient pas d’éléments non textuels trop complexes.",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "5dcc9cb2-653d-4f5c-96ea-16ecd12228bd",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Q : Puis-je travailler à plusieurs sur un projet ?",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "5daa1f25-da5d-4aa8-987c-05f338c9e458",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Pas encore, mais la fonctionnalité est en cours de développement !",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "cc8fa021-55c3-4bce-9faa-3ab8b219c92f",
      "type": "heading",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left",
        "level": 3
      },
      "content": [
        {
          "type": "text",
          "text": "Q : Est-ce que TD Editor est gratuit ?",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "ad2ca224-7880-4a72-be01-5e75937bab27",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Oui, une version gratuite est disponible, avec des options premium à venir.",
          "styles": {}
        }
      ],
      "children": []
    },
    {
      "id": "4e35c200-673d-404d-ba7e-e9d47a0c7b83",
      "type": "paragraph",
      "props": {
        "textColor": "default",
        "backgroundColor": "default",
        "textAlignment": "left"
      },
      "content": [
        {
          "type": "text",
          "text": "Besoin d’aide ? Contactez-nous via ",
          "styles": {}
        },
        {
          "type": "link",
          "href": "mailto:support@tdeditor.com",
          "content": [
            {
              "type": "text",
              "text": "support@tdeditor.com",
              "styles": {}
            }
          ]
        },
        {
          "type": "text",
          "text": " ou consultez notre ",
          "styles": {}
        },
        {
          "type": "link",
          "href": "#",
          "content": [
            {
              "type": "text",
              "text": "documentation complète",
              "styles": {}
            }
          ]
        },
        {
          "type": "text",
          "text": ".",
          "styles": {}
        }
      ],
      "children": []
    }
  ]

  return (
    <div className="xl:px-40 pt-4">
      <Editor content={content} readOnly={true} />
    </div>
  );
}
