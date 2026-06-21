import {createContext, useContext, useState, useEffect, ReactNode} from "react";
import {AuthService, UserService} from "./../utils/services";
import {setToken, clearToken, getToken, ApiError} from "./../utils/api"
import type {Usuario} from "@types";