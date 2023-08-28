import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react"
import { SettingsLayout } from '../../components/templates/SettingsLayout'
import { Button } from '../../components/elements/Button'
import { styled } from '../../components/tokens/stitches.config'
import {
  Box,
  SpanBox,
  HStack,
  VStack,
} from '../../components/elements/LayoutPrimitives'
import { Toaster } from 'react-hot-toast'
import { applyStoredTheme, isDarkTheme } from '../../lib/themeUpdater'
import { showErrorToast, showSuccessToast } from '../../lib/toastHelpers'
import { StyledText } from '../../components/elements/StyledText'
import {
  ArrowClockwise,
  DotsThree,
  PencilSimple,
  Trash,
  Plus,
} from 'phosphor-react'
import { GenericTableCardProps } from '../../utils/settings-page/labels/types'
import { TooltipWrapped } from '../../components/elements/Tooltip'
import { LabelColorDropdown } from '../../components/elements/LabelColorDropdown'
import {
  Dropdown,
  DropdownOption,
} from '../../components/elements/DropdownElements'
import { LabelChip } from '../../components/elements/LabelChip'
import { ConfirmationModal } from '../../components/patterns/ConfirmationModal'
import { InfoLink } from '../../components/elements/InfoLink'
import { useGetSavedSearchQuery } from "../../lib/networking/queries/useGetSavedSearchQuery"
import { SavedSearch } from "../../lib/networking/fragments/savedSearchFragment"
import { SearchState } from "pspdfkit"
import { Label } from "../../lib/networking/fragments/labelFragment"

const HeaderWrapper = styled(Box, {
  width: '100%',
})

const TableCard = styled(Box, {
  padding: '0px',
  backgroundColor: '$grayBg',
  display: 'flex',
  alignItems: 'center',
  border: '0.3px solid $grayBgActive',
  width: '100%',
  '@md': {
    paddingLeft: '0',
  },
})

const TableCardBox = styled(Box, {
  display: 'grid',
  width: '100%',
  gridGap: '$1',
  gridTemplateColumns: '3fr 1fr',
  '.showHidden': {
    display: 'none',
  },
  '&:hover': {
    '.showHidden': {
      display: 'unset',
      gridColumn: 'span 2',
      width: '100%',
      padding: '$2 $3 0 $3',
    },
  },
  '@md': {
    gridTemplateColumns: '20% 15% 1fr 1fr 1fr',
    '&:hover': {
      '.showHidden': {
        display: 'none',
      },
    },
  },
})

const inputStyles = {
  height: '35px',
  backgroundColor: 'transparent',
  color: '$grayTextContrast',
  padding: '6px 6px',
  margin: '$2 0',
  border: '1px solid $grayBorder',
  borderRadius: '6px',
  fontSize: '16px',
  FontFamily: '$fontFamily',
  width: '100%',
  '@md': {
    width: 'auto',
    minWidth: '180px',
  },
  '&[disabled]': {
    border: 'none',
  },
  '&:focus': {
    outlineColor: '$omnivoreYellow',
    outlineStyle: 'solid',
  },
}

const ActionsWrapper = styled(Box, {
  mr: '$1',
  display: 'flex',
  width: 40,
  height: 40,
  alignItems: 'center',
  bg: 'transparent',
  cursor: 'pointer',
  fontFamily: 'inter',
  fontSize: '$2',
  lineHeight: '1.25',
  color: '$grayText',
  '&:hover': {
    opacity: 0.8,
  },
})

const IconButton = styled(Button, {
  variants: {
    style: {
      ctaWhite: {
        color: 'red',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid $grayBorder',
        boxSizing: 'border-box',
        borderRadius: 6,
        width: 40,
        height: 40,
      },
    },
  },
})

const Input = styled('input', { ...inputStyles })

const TextArea = styled('textarea', { ...inputStyles })

export default function SavedSearchesPage(): JSX.Element {
  const { savedSearch } = useGetSavedSearchQuery()
  const [nameInputText, setNameInputText] = useState<string>('')
  const [queryInputText, setQueryInputText] = useState<string>('')
  const [editingId, setEditingId] = useState<string|null>(null);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(false)
  const [windowWidth, setWindowWidth] = useState<number>(0)
  const [confirmRemoveSavedSearchId, setConfirmRemoveSavedSearchId] = useState<
    string | null
  >(null)

  // Some theming stuff here.
  const breakpoint = 768
  applyStoredTheme(false)

  const sortedSavedSearch = useMemo(() => {
    return [{ id: "!", query: "in:inbox", name: "In Inbox"}] as SavedSearch[];
  }, [savedSearch]);

  useEffect(() => {
    const handleResizeWindow = () => setWindowWidth(window.innerWidth)
    if (windowWidth === 0) {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResizeWindow)
    return () => {
      window.removeEventListener('resize', handleResizeWindow)
    }
  }, [windowWidth])

  const resetSavedSearchState = () => {
    setIsCreateMode(false)
    setNameInputText('')
    setQueryInputText('')
    setEditingId(null)
  }

  async function createSavedSearch(): Promise<void> {
    return
  }

  async function updateSavedSearch(id: string): Promise<void> {
    return
  }

  const onEditPress = (savedSearch: SavedSearch | null) => {
    if (savedSearch) {
      setNameInputText(savedSearch.name)
      setQueryInputText(savedSearch.query || '')
      setEditingId(savedSearch.id)
    } else {
      resetSavedSearchState()
    }
  }

  async function onDeleteSavedSearch(id: string): Promise<void> {
    return
  }

  async function deleteSavedSearch(id: string): Promise<void> {
    setConfirmRemoveSavedSearchId(id)
  }

  return (
    <SettingsLayout>
      <Toaster
        containerStyle={{
          top: '5rem',
        }}
      />
      <HStack css={{ width: '100%', height: '100%' }}>
        <VStack
          css={{
            mx: '10px',
            color: '$grayText',
            width: '100%',
            maxWidth: '865px',
          }}
        >
          {confirmRemoveSavedSearchId ? (
            <ConfirmationModal
              message={
                'Are you sure?'
              }
              onAccept={() => {
                onDeleteSavedSearch(confirmRemoveSavedSearchId)
                setConfirmRemoveSavedSearchId(null)
              }}
              onOpenChange={() => setConfirmRemoveSavedSearchId(null)}
            />
          ) : null}
          <HeaderWrapper>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box>
                <StyledText style="fixedHeadline">Saved Searches </StyledText>
              </Box>
              <InfoLink href="/help/search" />
              <Box
                css={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginLeft: 'auto',
                }}
              >
                {isCreateMode ? null : (
                  <>
                    <Button
                      onClick={() => {
                        resetSavedSearchState()
                        setIsCreateMode(true)
                      }}
                      style="ctaDarkYellow"
                      css={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 'auto',
                      }}
                    >
                      <SpanBox
                        css={{
                          display: 'none',
                          '@md': {
                            display: 'flex',
                          },
                        }}
                      >
                        <SpanBox>Add Saved Search</SpanBox>
                      </SpanBox>
                      <SpanBox
                        css={{
                          p: '0',
                          display: 'flex',
                          '@md': {
                            display: 'none',
                          },
                        }}
                      >
                        <Plus size={24} />
                      </SpanBox>
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </HeaderWrapper>
          <>
            {isCreateMode ? (
              windowWidth > breakpoint ? (
                <DesktopEditCard
                  savedSearch={null}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  isCreateMode={isCreateMode}
                  deleteSavedSearch={deleteSavedSearch}
                  nameInputText={nameInputText}
                  queryInputText={queryInputText}
                  setNameInputText={setNameInputText}
                  setQueryInputText={setQueryInputText}
                  setIsCreateMode={setIsCreateMode}
                  createSavedSearch={createSavedSearch}
                  updateSavedSearch={updateSavedSearch}
                  onEditPress={onEditPress}
                  resetState={resetSavedSearchState}
                />
              ) : (
                <MobileEditCard
                  savedSearch={null}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  isCreateMode={isCreateMode}
                  deleteSavedSearch={deleteSavedSearch}
                  nameInputText={nameInputText}
                  queryInputText={queryInputText}
                  setNameInputText={setNameInputText}
                  setQueryInputText={setQueryInputText}
                  setIsCreateMode={setIsCreateMode}
                  createSavedSearch={createSavedSearch}
                  updateSavedSearch={updateSavedSearch}
                  onEditPress={onEditPress}
                  resetState={resetSavedSearchState}
                />
              )
            ) : null}
          </>
          {sortedSavedSearch
            ? sortedSavedSearch.map((savedSearch, i) => {
              const isLastChild = i === sortedSavedSearch.length - 1
              const isFirstChild = i === 0
              const cardProps = {
                savedSearch,
                editingId,
                isCreateMode: isCreateMode,
                isLastChild: isLastChild,
                isFirstChild: isFirstChild,
                setEditingId,
                deleteSavedSearch,
                nameInputText: nameInputText,
                queryInputText: queryInputText,
                setNameInputText: setNameInputText,
                setQueryInputText: setQueryInputText,
                setIsCreateMode: setIsCreateMode,
                createSavedSearch,
                resetState: resetSavedSearchState,
                updateSavedSearch,
                onEditPress,
              }

              if (editingId == savedSearch.id) {
                if (windowWidth >= breakpoint) {
                  return <DesktopEditCard {...cardProps} />
                } else {
                  return <MobileEditCard {...cardProps} />
                }
              }

              return (
                <GenericTableCard
                  key={savedSearch.id}
                  {...cardProps}
                  onEditPress={onEditPress}
                />
              )
            })
            : null}
        </VStack>
      </HStack>
      <Box css={{ height: '120px' }} />
    </SettingsLayout>
  )
}

type EditCardProps = {
  savedSearch: SavedSearch | null
  editingId: string | null
  nameInputText: string
  queryInputText: string
  setQueryInputText: Dispatch<SetStateAction<string>>
  isCreateMode: boolean
  setIsCreateMode: Dispatch<SetStateAction<boolean>>
  setEditingId:  Dispatch<SetStateAction<string | null>>
  setNameInputText: Dispatch<SetStateAction<string>>
  createSavedSearch: () => Promise<void>
  updateSavedSearch: (id: string) => Promise<void>
  deleteSavedSearch: (id: string) => Promise<void>
  resetState: () => void
  onEditPress: (savedSearch: SavedSearch | null) => void
  isFirstChild?: boolean | undefined
  isLastChild?: boolean | undefined
}

function GenericTableCard(
  props: EditCardProps & {
    isLastChild?: boolean
    isFirstChild?: boolean
  }
) {
  const {
    savedSearch,
    isLastChild,
    isFirstChild,
    editingId,
    isCreateMode,
    nameInputText,
    queryInputText,
    setQueryInputText,
    setEditingId,
    deleteSavedSearch,
    setNameInputText,
    createSavedSearch,
    updateSavedSearch,
    onEditPress,
    resetState,
  } = props
  const showInput = editingId === savedSearch?.id || (isCreateMode && !savedSearch)
  const iconColor = isDarkTheme() ? '#D8D7D5' : '#5F5E58'

  const handleEdit = () => {
    editingId && updateSavedSearch(editingId)
    setEditingId(null)
  }

  const moreActionsButton = () => {
    return (
      <ActionsWrapper>
        <Dropdown
          disabled={isCreateMode}
          triggerElement={<DotsThree size={24} color={iconColor} />}
        >
          <DropdownOption onSelect={() => null}>
            <Button
              style="plainIcon"
              css={{
                mr: '0px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: 0,
              }}
              onClick={() => onEditPress(savedSearch)}
              disabled={isCreateMode}
            >
              <PencilSimple size={24} color={"black"} />
              <StyledText
                color="$grayText"
                css={{ m: '0px', fontSize: '$5', marginLeft: '$2' }}
              >
                Edit
              </StyledText>
            </Button>
          </DropdownOption>
          <DropdownOption onSelect={() => null}>
            <Button
              style="plainIcon"
              css={{
                mr: '$1',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: 0,
              }}
              onClick={() => (savedSearch ? deleteSavedSearch(savedSearch.id) : null)}
              disabled={isCreateMode}
            >
              <Trash size={24} color="#AA2D11" />
              <StyledText
                css={{
                  m: '0px',
                  fontSize: '$5',
                  marginLeft: '$2',
                  color: '#AA2D11',
                }}
              >
                Delete
              </StyledText>
            </Button>
          </DropdownOption>
        </Dropdown>
      </ActionsWrapper>
    )
  }

  return (
    <TableCard
      css={{
        '&:hover': {
          background: 'rgba(255, 234, 159, 0.12)',
        },
        borderTopLeftRadius: isFirstChild ? '5px' : '',
        borderTopRightRadius: isFirstChild ? '5px' : '',
        borderBottomLeftRadius: isLastChild ? '5px' : '',
        borderBottomRightRadius: isLastChild ? '5px' : '',
      }}
    >
      <TableCardBox
        css={{
          display: 'grid',
          width: '100%',
          gridGap: '$1',
          gridTemplateColumns: '2fr 2fr',
          height: editingId == savedSearch?.id ? '120px' : '56px',
          '.showHidden': {
            display: 'none',
          },
          '&:hover': {
            '.showHidden': {
              display: 'unset',
              gridColumn: 'span 2',
              width: '100%',
              padding: '$2 $3 0 $3',
            },
          },
          '@md': {
            height: '56px',
            gridTemplateColumns: '20% 28% 1fr 1fr',
          },
        }}
      >
        <HStack
          distribution="start"
          alignment="center"
          css={{
            padding: '0 5px',
          }}
        >
          {showInput && !savedSearch ? (
            <SpanBox
              css={{
                '@smDown': {
                  display: 'none',
                },
              }}
            >
              <Input
                type="text"
                value={nameInputText}
                onChange={(event) => setNameInputText(event.target.value)}
                required
                autoFocus
              />
            </SpanBox>
          ) : (
            <StyledText
              style="body"
              css={{
                color: '$grayTextContrast',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                paddingLeft: '15px'
              }}
            >
              {editingId === savedSearch?.id
                ? nameInputText
                : savedSearch?.name || ''}
            </StyledText>
          )}
        </HStack>

        <HStack
          distribution="start"
          alignment="center"
          css={{
            display: 'none',
            '@md': {
              display: 'flex',
            },
          }}
        >
          {showInput ? (
            <Input
              type="text"
              placeholder="Query (e.g. in:inbox)"
              value={queryInputText}
              onChange={(event) => setQueryInputText(event.target.value)}
              autoFocus={!!savedSearch}
            />
          ) : (
            <StyledText
              style="body"
              css={{
                color: '$grayTextContrast',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {editingId === savedSearch?.id
                ? queryInputText
                : savedSearch?.query || ''}
            </StyledText>
          )}
        </HStack>

        <HStack
          distribution="start"
          css={{
            padding: '4px 8px',
            paddingLeft: '10px',
            alignItems: 'center',
          }}
        >
          {!showInput && (
            <Box css={{ marginLeft: 'auto', '@md': { display: 'none' } }}>
              {moreActionsButton()}
            </Box>
          )}
        </HStack>

        <HStack
          distribution="start"
          alignment="center"
          css={{
            ml: '8px',
            display: 'flex',
            '@md': {
              display: 'none',
            },
          }}
        >
          {showInput && (
            <Input
              type="text"
              placeholder="The search query to execute (e.g. in:inbox)"
              value={queryInputText}
              onChange={(event) => setQueryInputText(event.target.value)}
              autoFocus={!!savedSearch}
            />
          )}
        </HStack>

        <HStack
          distribution="end"
          alignment="center"
          css={{
            padding: '0px 8px',
          }}
        >
          {editingId === savedSearch?.id || !savedSearch ? (
            <>
              <Button
                style="plainIcon"
                css={{ mr: '$1' }}
                onClick={() => {
                  resetState()
                }}
              >
                Cancel
              </Button>
              <Button
                style="ctaDarkYellow"
                css={{ my: '0px', mr: '$1' }}
                onClick={() => (savedSearch ? handleEdit() : createSavedSearch())}
              >
                Save
              </Button>
            </>
          ) : (
            <HStack
              distribution="end"
              alignment="end"
              css={{
                display: 'none',
                '@md': {
                  display: 'flex',
                  width: '100%',
                },
              }}
            >
              <IconButton
                style="ctaWhite"
                css={{ mr: '$1', background: '$labelButtonsBg' }}
                onClick={() => onEditPress(savedSearch)}
                disabled={isCreateMode}
              >
                <PencilSimple size={16} color={iconColor} />
              </IconButton>
              <IconButton
                style="ctaWhite"
                css={{ mr: '$1', background: '$labelButtonsBg' }}
                onClick={() => deleteSavedSearch(savedSearch.id)}
                disabled={isCreateMode}
              >
                <Trash size={16} color={iconColor} />
              </IconButton>
            </HStack>
          )}
        </HStack>
      </TableCardBox>
    </TableCard>
  )
}
function MobileEditCard(props: EditCardProps) {
  const {
    savedSearch,
    editingId,
    setEditingId,
    isCreateMode,
    nameInputText,
    setNameInputText,
    queryInputText,
    setQueryInputText,
    createSavedSearch,
    resetState,
    updateSavedSearch,
    isFirstChild,
    isLastChild,
  } = props

  const handleEdit = () => {
    console.log(editingId)
    editingId && setEditingId(editingId)
    setEditingId(null)
  }

  return (
    <TableCard
      css={{
        borderTopLeftRadius: isFirstChild ? '5px' : '',
        borderTopRightRadius: isFirstChild ? '5px' : '',
        borderBottomLeftRadius: isLastChild ? '5px' : '',
        borderBottomRightRadius: isLastChild ? '5px' : '',
      }}
    >
      <VStack distribution="center" css={{ width: '100%', margin: '8px' }}>
        <Input
          type="text"
          value={nameInputText}
          onChange={(event) => setNameInputText(event.target.value)}
          autoFocus
        />

        <TextArea
          placeholder="Query (e.g. in:inbox)"
          value={queryInputText}
          onChange={(event) => setQueryInputText(event.target.value)}
          rows={5}
        />
        <HStack
          distribution="end"
          alignment="center"
          css={{ width: '100%', margin: '$1 0' }}
        >
          <Button
            style="plainIcon"
            css={{ mr: '$1' }}
            onClick={() => {
              resetState()
            }}
          >
            Cancel
          </Button>
          <Button
            style="ctaDarkYellow"
            css={{ mr: '$1' }}
            onClick={() => (savedSearch ? handleEdit() : createSavedSearch())}
          >
            Save
          </Button>
        </HStack>
      </VStack>
    </TableCard>
  )
}

function DesktopEditCard(props: EditCardProps) {
  const {
    savedSearch,
    editingId,
    setEditingId,
    nameInputText,
    setNameInputText,
    queryInputText,
    setQueryInputText,
    createSavedSearch,
    resetState,
    updateSavedSearch,
    isFirstChild,
    isLastChild,
  } = props

  const handleEdit = () => {
    editingId && updateSavedSearch(editingId)
    setEditingId(null)
  }

  return (
    <TableCard
      css={{
        width: '100%',
        borderTopLeftRadius: isFirstChild ? '5px' : '',
        borderTopRightRadius: isFirstChild ? '5px' : '',
        borderBottomLeftRadius: isLastChild ? '5px' : '',
        borderBottomRightRadius: isLastChild ? '5px' : '',
      }}
    >
      <VStack
        distribution="center"
        css={{ width: '100%', my: '8px', ml: '8px', mr: '0px' }}
      >
        <HStack
          distribution="start"
          alignment="center"
          css={{ pt: '6px', px: '13px', width: '100%', gap: '16px' }}
        >
          <Input
            type="text"
            placeholder="Name"
            value={nameInputText}
            onChange={(event) => setNameInputText(event.target.value)}
            autoFocus
          />

          <Input
            type="text"
            placeholder="Query (e.g. in:inbox)"
            value={queryInputText}
            onChange={(event) => setQueryInputText(event.target.value)}
          />
          <HStack
            distribution="end"
            alignment="center"
            css={{ marginLeft: 'auto', width: '100% ' }}
          >
            <Button
              style="ctaOutlineYellow"
              css={{ mr: '12px' }}
              onClick={() => {
                resetState()
              }}
            >
              Cancel
            </Button>
            <Button
              style="ctaDarkYellow"
              css={{}}
              onClick={() => (savedSearch ? handleEdit() : createSavedSearch())}
            >
              Save
            </Button>
          </HStack>
        </HStack>
      </VStack>
    </TableCard>
  )
}
