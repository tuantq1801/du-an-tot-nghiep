import React, { useState } from 'react'
import * as XLSX from "xlsx"
import { UploadOutlined } from '@ant-design/icons';
import '../../../common/styles/upfile.css'
import DataAPI from '../../../API/Data';
const UpFile = () => {
    const [data, setData] = useState()
    const [header, setHeader] = useState([])
    const [dataNew, setDataNew] = useState([])
    const [nameFile, setNameFile] = useState('')

    const importData = (e) => {
        const file = e.target.files[0]
        setNameFile(file.name)
        const reader = new FileReader()
        reader.onload = (event) => {

            const bstr = event.target.result
            const wordBook = XLSX.read(bstr, { type: "binary" })
            const wordSheetName = wordBook.SheetNames[0]
            const wordSheet = wordBook.Sheets[wordSheetName]
            const fileData = XLSX.utils.sheet_to_json(wordSheet, { header: 1 })
            fileData.splice(0, 1)
            const headers = fileData[0]
            const heads = headers.map((head, index) => ({ title: head, key: index }))
            setHeader(heads)

            const rows = []
            fileData.forEach(item => {
                let rowData = {}
                item.forEach((element, index) => {
                    rowData[headers[index]] = element
                })
                rows.push(rowData)
            });

            setDataNew(rows.filter((item, index) => index !== 0))
            setData(fileData)

        }
        reader.readAsBinaryString(file)

    }
    const submitSave = () => {
        DataAPI.add({ data: dataNew })
    }
    const submitCole = () => {
        setData()
        setNameFile()
    }
    return (
        <div className='up-file'>
            <h3>Tải danh sách mới</h3>
            <div className="header">
                <label htmlFor="up-file">
                    <div className='button-upfile'> <UploadOutlined className='icon' />  Tải file excel</div>  {nameFile && <span>{nameFile}</span>}
                </label>
                <input type="file" onChange={(e) => importData(e)} id="up-file" />
                {
                    data &&
                    <div className="button_save">
                        <button onClick={() => submitSave()}>Lưu</button>
                        <button onClick={() => submitCole()}>Hủy</button>
                    </div>
                }

            </div>
            {data !== undefined &&
                <table >
                    <thead></thead>
                    <tbody>
                        {data !== undefined && data.map((r, i) => (
                            <tr key={i}>
                                {header.map((c, index) => (
                                    <td key={index}>{r[c.key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

            }
        </div>
    )
}

export default UpFile