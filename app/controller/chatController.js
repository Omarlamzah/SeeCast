const { db } = require("../config/conectdb");

const createQuestion = (text) => {
    const insertStmt = db.prepare("INSERT INTO question (text) VALUES (?)");
    const result = insertStmt.run(text);
    return result.lastInsertRowid;
}

const updateQuestion = (id, newText) => {
    const updateStmt = db.prepare("UPDATE question SET text = ? WHERE id = ?");
    const result = updateStmt.run(newText, id);
    return result.changes > 0; // Returns true if any rows were updated
}

const removeQuestion = (id) => {
    const deleteStmt = db.prepare("DELETE FROM question WHERE id = ?");
    const result = deleteStmt.run(id);
    return result.changes > 0; // Returns true if any rows were deleted
}   

const removeallQuestion=()=>{
    const result = db.prepare("DELETE FROM question").run();
    return result; // Returns true if any rows were deleted
}

const getQuestions = () => {
    const query = "SELECT * FROM question";
    return db.prepare(query).all();
}

module.exports = {
    createQuestion,
    updateQuestion,
    removeQuestion,
    getQuestions,
    removeallQuestion
};
