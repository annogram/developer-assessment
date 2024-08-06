import './App.css'
import { Image, Container, Row, Col } from 'react-bootstrap'
import { EntryList } from './todo-list/components/entry-list'
import {
  useCreateEntryMutation,
  useDeleteEntryMutation,
  useGetEntries,
  useUpdateEntryMutation
} from './todo-list/api'
import { Todo } from './todo-list/types/entry'
import { CreateEntry } from './todo-list/components/create-entry'


export default function App() {
  const entries = useGetEntries()
  const { mutate: updateEntry } = useUpdateEntryMutation()
  const { mutate: createEntry } = useCreateEntryMutation()
  const { mutate: deleteEntry } = useDeleteEntryMutation()
  const handleDescriptionUpdated = (item: Todo, description: string) => {
    updateEntry({ ...item, description })
  }

  const handleCheckChanged = (item: Todo, isCompleted: boolean) => updateEntry({ ...item, isCompleted })

  console.log(entries)
  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <Image src="clearPointLogo.png" fluid rounded />
          </Col>
        </Row>


        <br />

        <EntryList
          items={entries.data ?? []}
          onDescriptionUpdated={handleDescriptionUpdated}
          onCheckItemChanged={handleCheckChanged}
          onDeleteItem={deleteEntry}
        />
        <CreateEntry onCreate={createEntry} />

      </Container>
      <footer className="page-footer font-small teal pt-4">
        <div className="footer-copyright text-center py-3">
          © 2021 Copyright:
          <a href="https://clearpoint.digital" target="_blank" rel="noreferrer">
            clearpoint.digital
          </a>
        </div>
      </footer>
    </div>
  )
}
