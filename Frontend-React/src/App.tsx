import './App.css'
import { Image, Alert, Button, Container, Row, Col, Form, Table, Stack } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import { EntryList } from './todo-list/components/entry-list'
import { useGetEntries, useUpdateEntryMutation } from './todo-list/api'
import { useDebouncedCallback } from 'use-debounce'
import { Todo } from './todo-list/types/entry'


export default function App() {
  const [description, setDescription] = useState('')
  const entries = useGetEntries()
  const { mutate, isPending } = useUpdateEntryMutation()

  const handleDescriptionUpdated = useDebouncedCallback((item: Todo, description: string) => {
    mutate({ ...item, description })
  }, 1500)

  const handleCheckChanged = (item: Todo, isCompleted: boolean) => mutate({ ...item, isCompleted })

  const [items, setItems] = useState<{ id: number; description: string }[]>([])

  useEffect(() => {
    // todo
  }, [])

  const renderAddTodoItemContent = () => {
    return (
      <Container>
        <h1>Add Item</h1>
        <Form.Group as={Row} className="mb-3" controlId="formAddTodoItem">
          <Form.Label column sm="2">
            Description
          </Form.Label>
          <Col md="6">
            <Form.Control
              type="text"
              placeholder="Enter description..."
              value={description}
              onChange={handleDescriptionChange}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3 offset-md-2" controlId="formAddTodoItem">
          <Stack direction="horizontal" gap={2}>
            <Button variant="primary" onClick={() => handleAdd()}>
              Add Item
            </Button>
            <Button variant="secondary" onClick={() => handleClear()}>
              Clear
            </Button>
          </Stack>
        </Form.Group>
      </Container>
    )
  }

  const handleDescriptionChange = (event) => {
    // todo
  }

  async function getItems() {
    try {
      alert('todo')
    } catch (error) {
      console.error(error)
    }
  }

  async function handleAdd() {
    try {
      alert('todo')
    } catch (error) {
      console.error(error)
    }
  }

  function handleClear() {
    setDescription('')
  }

  async function handleMarkAsComplete(item) {
    try {
      alert('todo')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <Image src="clearPointLogo.png" fluid rounded />
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="success">
              <Alert.Heading>Todo List App</Alert.Heading>
              Welcome to the ClearPoint frontend technical test. We like to keep things simple, yet clean so your
              task(s) are as follows:
              <br />
              <br />
              <ol className="list-left">
                <li>Add the ability to add (POST) a Todo Item by calling the backend API</li>
                <li>
                  Display (GET) all the current Todo Items in the below grid and display them in any order you wish
                </li>
                <li>
                  Bonus points for completing the 'Mark as completed' button code for allowing users to update and mark
                  a specific Todo Item as completed and for displaying any relevant validation errors/ messages from the
                  API in the UI
                </li>
                <li>Feel free to add unit tests and refactor the component(s) as best you see fit</li>
              </ol>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>{renderAddTodoItemContent()}</Col>
        </Row>

        <br />

        <EntryList 
          items={entries.data ?? []}
          handleDescriptionUpdated={handleDescriptionUpdated}
          onCheckItemChanged={handleCheckChanged}
        />


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
