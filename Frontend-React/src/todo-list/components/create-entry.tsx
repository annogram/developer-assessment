import { FC, useRef } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Todo } from "../types/entry";

export interface CreateEntryProps {
    onCreate: (todo: Pick<Todo, 'description' | 'isCompleted'>) => void;
}

export const CreateEntry: FC<CreateEntryProps> = ({ onCreate }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return <Row>
        <Col>
            <InputGroup aria-label="Create Todo Item">
                <Form.Control placeholder="Add a new todo" className="rounded-0" ref={inputRef} onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onCreate({ description: inputRef.current?.value, isCompleted: false});
                        inputRef.current.value = "";
                    }
                }}/>
                <Button variant="primary" onClick={() => {
                    if (inputRef.current) {
                        onCreate({ description: inputRef.current.value, isCompleted: false});
                        inputRef.current.value = "";
                    }
                }}>Add</Button>
            </InputGroup>
        </Col>
    </Row>
}